const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

router.post('/register', authController.registerValidation, validate, authController.register);
router.post('/login', authController.loginValidation, validate, authController.login);

router.get('/me', authenticate, authController.getMe);

module.exports = router;
