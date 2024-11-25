// src/routes/index.js
const router = require('express').Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const studentRoutes = require('./student.routes');
const interventionRoutes = require('./intervention.routes');
const InterventionCommentRoutes = require('./comment.routes');
const authMiddleware = require('../middleware/auth');

router.use('/auth', authRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/students', authMiddleware, studentRoutes);
router.use('/interventions', authMiddleware, interventionRoutes);
router.use('/intervention-comments', authMiddleware, InterventionCommentRoutes);

module.exports = router;