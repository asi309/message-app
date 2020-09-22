const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', [
  body('email').isEmail().withMessage('Please enter a valid email').custom((value, {req}) => {
    return User.findOne({email: value}).then(userDoc => {
      if (userDoc) {
        return Promise.reject('Email address already exists');
      }
    });
  }).normalizeEmail(),
  body('password').trim().isLength({ min: 5 }),
  body('name').trim().notEmpty()
], authController.postSignup);

router.post('/login', authController.postLogin);

module.exports = router;