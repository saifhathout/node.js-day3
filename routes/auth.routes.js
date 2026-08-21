const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const validate = require('../middlewares/validation.middleware');
const { protect } = require('../middlewares/auth.middleware');
const {
  register,
  login,
  getMe
} = require('../controllers/auth.controller');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'manager', 'user'])
      .withMessage('Invalid role')
  ],
  validate,        
  register       
);


router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

module.exports = router;