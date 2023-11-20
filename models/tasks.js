const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = mongoose.model('task', {
  title: String,
  deadline: Date,
  priority: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = TaskSchema;
