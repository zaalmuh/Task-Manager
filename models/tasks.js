const mongoose = require('mongoose');

const TaskSchema = mongoose.model('task', {
  title: String,
  deadline: Date,
  priority: String,
});

module.exports = TaskSchema;
