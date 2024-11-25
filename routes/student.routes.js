// src/routes/student.routes.js
const router = require('express').Router();
const StudentController = require('../controllers/StudentController');

router.get('/check-rut/:rut', StudentController.checkRutExists.bind(StudentController));
router.post('/', StudentController.create.bind(StudentController));
router.get('/:id', StudentController.findOne.bind(StudentController));
router.get('/', StudentController.findAll.bind(StudentController));
router.put('/:id', StudentController.update.bind(StudentController));
router.delete('/:id', StudentController.remove.bind(StudentController));




module.exports = router;