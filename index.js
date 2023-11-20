const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const methodOverride = require('method-override');
const Task = require('./models/tasks');
const path = require('path');
const Quote = require('inspirational-quotes');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const { isLoggedIn } = require('./middleware');

mongoose.connect('mongodb://127.0.0.1:27017/taskManager');
const db = mongoose.connection;

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Task Manager');
      res.redirect('/login');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
});

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});

app.get('/', isLoggedIn, async (req, res) => {
  const tasks = await Task.find({ author: req.user._id });
  const { text, author } = Quote.getQuote();
  res.render('main', { tasks, text, author });
});

app.get('/:id/edit/', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  let date = new Date().toJSON().slice(0, 10);
  const findTask = await Task.findById(id);
  res.render('edit', { findTask, date });
});

app.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash('success', 'Goodbye!');
  res.redirect('/login');
});

app.get('/add', isLoggedIn, (req, res) => {
  let date = new Date().toJSON().slice(0, 10);
  res.render('add', { date });
});

app.post('/', isLoggedIn, async (req, res) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const task = new Task(req.body);
  task.author = req.user._id;
  await task.save();
  res.redirect('/');
});

app.put('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const tasks = await Task.findByIdAndUpdate(id, { ...req.body });
  res.redirect('/');
});

app.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  const tasks = await Task.find();
  const { text, author } = Quote.getQuote();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Serving on Port 3000');
});
