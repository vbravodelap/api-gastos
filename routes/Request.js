'use strict'

const express = require('express');
const router = express.Router();
const RequestController = require('../controllers/Request');
const { check } = require('express-validator');
var authMiddleware = require('../middlewares/authenticated');

router.post('/request/store', [
    check('concept').not().isEmpty().withMessage('El conceptop es requerido'),
    check('description').not().isEmpty().withMessage('La descripción es requerida'),
    check('amount').not().isEmpty().isFloat().withMessage('La cantidad es requerida'),
    authMiddleware.auth
], RequestController.store);

router.get('/requests', RequestController.getRequests);
router.get('/requests/user', authMiddleware.auth, RequestController.getRequestsByUser);
router.get('/request/:requestId', authMiddleware.auth, RequestController.getRequest);
router.post('/request/:requestId/check', authMiddleware.auth, RequestController.checkRequest);

module.exports = router;