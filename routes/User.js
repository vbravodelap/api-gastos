'use strict'

var express = require('express');
var UserController = require('../controllers/User');
const { check } = require('express-validator');
var authMiddleware = require('../middlewares/authenticated');


var router = express.Router();

router.post('/user/store', [
    check('email').isEmail().withMessage('Debe poner un correo valido.'),
    check('password').isLength({ min: 6, max: 16 }).withMessage('La contraseña debe tener 6 caracteres y menos de 16.'),
    check('username').not().isEmpty().withMessage('El campo nombre de usuario no puede ir vacio'),
    check('name').not().isEmpty().withMessage('El campo nombre de usuario no puede ir vacio'),
    authMiddleware.auth
],UserController.store);

router.put('/user/update', [
    check('username').not().isEmpty().withMessage('El campo nombre de usuario no puede ir vacio'),
    check('name').not().isEmpty().withMessage('El campo nombre de usuario no puede ir vacio'),
    check('email').isEmail().withMessage('Debe poner un correo valido.'),
    authMiddleware.auth
], UserController.edit);

router.post('/user/login', [
    check('email').isEmail().withMessage('Este correo no es valido'),
    check('password').not().isEmpty().withMessage('La contraseña no puede ir vacia.')
], UserController.login);

router.delete('/user/:userId', authMiddleware.auth, UserController.delete);

router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);



module.exports = router;