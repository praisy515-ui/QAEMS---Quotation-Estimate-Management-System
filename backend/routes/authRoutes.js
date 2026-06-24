const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginRules, registerRules } = require('../validations/authValidation');
const validate = require('../middleware/validationMiddleware');

router.post('/login', loginRules, validate, authController.login);
router.post('/register', registerRules, validate, authController.register);

module.exports = router;
