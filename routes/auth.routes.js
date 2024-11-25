// src/routes/auth.routes.js
const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

module.exports = router;