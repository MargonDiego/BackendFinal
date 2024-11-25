const router = require('express').Router();
const AuditController = require('/controllers/audit.controller');

router.get('/', AuditController.findAll);
router.get('/:id', AuditController.findOne);


module.exports = router;
