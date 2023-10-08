const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const methodOverride = require('method-override');
const Task = require('./models/tasks');
mongoose.connect('mongodb://127.0.0.1:27017/taskManager');
const db = mongoose.connection;
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.render('main', { tasks });
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
  res.render('main', { tasks });
});

app.listen(3000, () => {
  console.log('Serving on Port 3000');
});
