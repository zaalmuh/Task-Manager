const mongoose = require('mongoose');

const TaskSchema = mongoose.model('task', {
  title: String,
});

module.exports = TaskSchema;
