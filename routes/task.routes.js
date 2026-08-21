const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const validate = require('../middlewares/validation.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require('../controllers/task.controller');

router.use(protect);

router.get('/', getTasks);          
router.get('/:id', getTaskById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('status')
      .optional()
      .isIn(['created', 'in progress', 'done'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Priority must be between 1 and 10'),
    body('dueDate')
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('assignedTo')
      .isMongoId()
      .withMessage('assignedTo must be a valid User ID'),
    body('collaborators')
      .optional()
      .isArray()
      .withMessage('Collaborators must be an array'),
    body('collaborators.*')
      .optional()
      .isMongoId()
      .withMessage('Each collaborator must be a valid User ID')
  ],
  validate,
  createTask
);

router.put('/:id', authorize('admin', 'manager'), updateTask);
router.patch('/:id/status', authorize('admin', 'manager'), updateTaskStatus);
router.delete('/:id', authorize('admin'), deleteTask);

module.exports = router;