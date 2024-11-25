// src/routes/intervention.routes.js
const router = require('express').Router();
const InterventionController = require('../controllers/InterventionController');
router.get('/', InterventionController.findAll);
router.get('/:id', InterventionController.findOne);
router.post('/', InterventionController.create);
router.put('/:id', InterventionController.update);
router.delete('/:id', InterventionController.remove);


module.exports = router;