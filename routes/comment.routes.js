const commentController = require('../controllers/commentController')
const router = require('express').Router();

router.get('/', commentController.findAll);
router.post('/', commentController.create);
router.put('/:id',commentController.update);
router.delete('/:id',commentController.remove);

module.exports = router;
