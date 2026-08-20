const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['created', 'in progress', 'done'],
        message: 'Status must be created, in progress, or done',
      },
      default: 'created',
    },

    priority: {
      type: Number,
      required: [true, 'Priority is required'],
      min: [1, 'Priority cannot be less than 1'],
      max: [10, 'Priority cannot be greater than 10'],
    },

    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned user is required'],
    },

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;