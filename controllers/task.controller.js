const Task = require('../models/task.model');
const User = require('../models/user.model');
const { AppError } = require('../middlewares/error.middleware');

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
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('collaborators', 'name email');

    if (!task) {
      return next(new AppError(404, 'Task not found'));
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, collaborators } = req.body;

    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return next(new AppError(404, 'Assigned user not found'));
    }

    if (collaborators && collaborators.length > 0) {
      const usersCount = await User.countDocuments({
        _id: { $in: collaborators },
      });

      if (usersCount !== collaborators.length) {
        return next(new AppError(404, 'One or more collaborators not found'));
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'created',
      priority: priority || 5,
      dueDate,
      assignedTo,
      collaborators: collaborators || []
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('collaborators', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedTo, collaborators } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return next(new AppError(404, 'Task not found'));
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.collaborators = collaborators || task.collaborators;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('collaborators', 'name email');

    res.status(200).json({
      success: true,
      data: populatedTask,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return next(new AppError(404, 'Task not found'));
    }

    await task.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return next(new AppError(404, 'Task not found'));
    }

    task.status = status;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('collaborators', 'name email');

    res.status(200).json({
      success: true,
      data: populatedTask,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};