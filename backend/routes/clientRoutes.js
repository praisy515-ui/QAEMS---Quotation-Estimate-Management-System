const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
const clientRules = require('../validations/clientValidation');
const validate = require('../middleware/validationMiddleware');

router.use(authMiddleware);

router.post('/', clientRules, validate, clientController.createClient);
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientDetails);
router.put('/:id', clientRules, validate, clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
