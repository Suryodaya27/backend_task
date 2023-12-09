const express = require('express');
const signupController = require('../controllers/signup.controller');
const router = express.Router();
// POST /signup
router.post('/signup', signupController);

module.exports = router;
