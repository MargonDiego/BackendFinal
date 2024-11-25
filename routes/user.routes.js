const router = require('express').Router();
const UsuarioController = require('../controllers/usuarioController');


router.get('/', UsuarioController.findAll);
router.get('/:id', UsuarioController.findOne);
router.post('/', UsuarioController.create);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.remove);

module.exports = router;
