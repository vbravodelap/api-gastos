'use strict'

var Request = require('../models/Request');
var User = require('../models/User');
const { validationResult } = require('express-validator');

var controller = {
    store: function(req, res) {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(422).json( { errors: errors.array() });
        }
        
        Request.create({
            concept: req.body.concept,
            description: req.body.description,
            amount: req.body.amount,
            status: 'Pendiente',
            checked: false,
            user: req.user.sub
        }).then( user => {
            return res.json(user);
        }).catch( err => {
            return res.json(err);
        }); 

    },

    getRequests: function(req, res) {
        Request.find().populate('user').exec((err, requests) => {
            if(err) {
                res.json(err);
            }

            return res.status(200).send({
                status: 'success',
                requests
            });
        })
    }
}

module.exports = controller;