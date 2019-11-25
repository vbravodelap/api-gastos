'use strict'

const log = console.log;
var User = require('../models/User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var JWT = require('jwt-simple');
const SECRET_KEY = 'pJaReaow0RHNjj7NQriypOPxANN58krjQCtuFBjSKtMzNpLxob7vaXKF54Hxzy6Bv314KL7Qt7G0bwIwCHCHedZuq6LEIOcgTVjm';
const { validationResult } = require('express-validator');

var controller = {
    
    store: function(req, res) {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }

        User.findOne({ email: req.body.email }, (err, issetEmail) => {

            if(issetEmail) {
                return res.status(409).send({
                    status: 'error',
                    message: 'Ya existe este correo en nuestros registros.'
                });
            }

            if(!issetEmail) {
                User.findOne({ username: req.body.username }, (err, issetUsername) => {
                    if(issetUsername) {
                        return res.status(409).send({
                            status: 'error',
                            message: 'Este nombre de usuario ya existe'
                        });
                    }

                    bcrypt.hash(req.body.password, null, null, (err, hash) => {
                        User.create({
                            name: req.body.name,
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            requested: 0,
                            checked: 0,
                            role: 'USER'
                        }).then(user => {
                            return res.json(user);
                        }).catch(err => {
                            return res.json(err);
                        });
                    });

                    
                });
            }
        })
    },

    edit: function(req, res) {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }

        var userId = req.user.sub;

        if(req.user.email != req.body.email) {
            User.findOne( { email: req.body.email }, (err, user) => {
                if(err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al identificarse.'
                    });
                }

                if(user && user.email == req.body.email) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'El mail no puede ser modificado.'
                    });
                }else{
                    User.findByIdAndUpdate({ _id: userId}, req.body, { new: true }, (err, updatedUser) => {
                        if(err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al actualizar el usuario,'
                            });
                        }

                        if(!updatedUser) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'No se ha actualizado el usuario,'
                            });
                        }

                        return res.status(200).send({
                            status: 'success',
                            updatedUser
                        });
                    });
                }
            });
        }
    },

    delete: function(req, res) {
        var userId = req.params.userId;

        if(!userId) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el id del usuario.'
            });
        }

        User.findById(userId).remove((err, deletedUser) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar el usuario.'
                });
            }

            return res.status(200).send({
                status: 'success',
                message: 'El usuario se ha eliminado correctamente.',
                deletedFor: req.user.name
            });
        })
    },

    login: function(req, res) {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }

        User.findOne( { email: req.body.email } , (err, user) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: err
                });
            }

            if(!user) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario'
                });
            }

            bcrypt.compare(req.body.password, user.password, (err, check) => {
                if(err) {
                    return res.status(403).send({
                        status: 'error',
                        message: 'La contraseña no es correcta',
                        err
                    });
                }

                if(check) {
                    user.password = undefined;
                    return res.status(200).send({
                        token: jwt.createToken(user),
                        user
                    });
                }else{
                    return res.status(403).send({
                        status: 'error',
                        message: 'La contrasña es incorrecta'
                    });
                }
            });
        });

    },

    getIdentity: function(req, res) {
        var token = req.headers.authorization;

        if(token) {
            var user = JWT.decode(token, SECRET_KEY);
            return res.status(200).send({
                status: 'success',
                user
            });
        }else{
            return res.status(404).send({
                status: 'error',
                message: 'error al decodificar el token'
            });
        }
    },

    getUser: function(req, res) {
        var userId = req.params.userId;

        if(!userId) {
            return res.status(500).send({
                status: 'error',
                message: 'Falta el parametro userId en la url.'
            });
        }

        User.findById(userId, (err, user) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: error
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        }); 
    },

    getUsers: function(req, res){
        User.find().exec((err, users) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: err
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            });
        });
    }
}

module.exports = controller;