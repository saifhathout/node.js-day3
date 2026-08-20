const express = require('express');
const { body } = require('express-validator');

const validate = require('../middlewares/validation.middleware');
const {
  createUser,
  getUsers,      
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/', getUsers);

router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),

    body('role')
      .trim()
      .notEmpty()
      .withMessage('Role is required'),
  ],
  validate,
  createUser
);

module.exports = router;