const mongoose = require('mongoose');
const { TASK_STATUS } = require('../utils/constants');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.PENDING
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

taskSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
