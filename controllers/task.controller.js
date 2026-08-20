const Task = require('../models/task.model');
const User = require('../models/user.model');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('collaborators', 'name email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const {
      assignedTo,
      collaborators = [],
    } = req.body;

    const assignedUser = await User.findById(assignedTo);

    if (!assignedUser) {
      const error = new Error('Assigned user not found');
      error.statusCode = 404;
      throw error;
    }

    if (collaborators.length > 0) {
      const usersCount = await User.countDocuments({
        _id: { $in: collaborators },
      });

      if (usersCount !== collaborators.length) {
        const error = new Error('One or more collaborators not found');
        error.statusCode = 404;
        throw error;
      }
    }

    const task = await Task.create(req.body);

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('collaborators', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,    
  createTask,
};