'use strict'

var User = require('../models/User');
const { check, validationResult } = require('express-validator');

var controller = {
    
    store: function(req, res) {
        
        check('email').isEmail();
        check('password').isLength({ min: 5, max: 16 });

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json( { errors: errors.array() });
        }

        User.create({
            name: req.body.name,
            username: req.body.name,
            email: req.body.email,
            password: req.body.password,
            requested : req.body.requested,
            checked: req.body.checked,
            role: req.body.role,
        }).then( user => {
            res.json(user);
        }); 

    },

    edit: function(req, res) {

    },

    delete: function(req, res) {

    },

    login: function(req, res) {

    }
}

module.exports = controller;