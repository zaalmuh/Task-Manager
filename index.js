const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const methodOverride = require('method-override');
const Task = require('./models/tasks');
const path = require('path');
const Quote = require('inspirational-quotes');
mongoose.connect('mongodb://127.0.0.1:27017/taskManager');
const db = mongoose.connection;
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const tasks = await Task.find();
  const { text, author } = Quote.getQuote();
  res.render('main', { tasks, text, author });
});
app.get('/:id/edit/', async (req, res) => {
  const { id } = req.params;
  let date = new Date().toJSON().slice(0, 10);
  const findTask = await Task.findById(id);
  res.render('edit', { findTask, date });
});

app.get('/add', (req, res) => {
  let date = new Date().toJSON().slice(0, 10);
  res.render('add', { date });
});

app.post('/', async (req, res) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  Task.insertMany(req.body);
  const tasks = await Task.find();
  res.redirect('/');
});

app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const tasks = await Task.findByIdAndUpdate(id, { ...req.body });
  res.redirect('/');
});

app.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  const tasks = await Task.find();
  const { text, author } = Quote.getQuote();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Serving on Port 3000');
});
