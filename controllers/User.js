'use strict'

const log = console.log;
var User = require('../models/User');
var bcrypt = require('bcrypt-nodejs');
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

    },

    delete: function(req, res) {

    },

    login: function(req, res) {

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