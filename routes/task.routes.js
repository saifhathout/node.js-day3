const express = require('express');
const { body } = require('express-validator');

const validate = require('../middlewares/validation.middleware');
const {
  createTask,
  getTasks,       
} = require('../controllers/task.controller');

const router = express.Router();

router.get('/', getTasks);

router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required'),

    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),

    body('status')
      .isIn(['created', 'in progress', 'done'])
      .withMessage('Invalid status'),

    body('priority')
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
      .withMessage('Each collaborator must be a valid User ID'),
  ],
  validate,
  createTask
);

module.exports = router;