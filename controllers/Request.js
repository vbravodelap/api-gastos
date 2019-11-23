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

        }).then( request => {

            User.findById(req.user.sub, (err, user) => {
                if(err){
                    return res.json(err);
                }

                user.requested = request.amount;

                user.save((err, user) => {
                    if(err) {
                        return res.json(err)
                    }

                    return res.status(200).send({
                        status: 'success',
                        request,
                        userUpdate: user
                    });
                });
            });
            
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
    },

    getRequestsByUser: function(req, res) {
        var userId = req.user.sub;

        Request.find( { user: userId} , (err, requests) => {
            if(err) {
                return res.json(err)
            }

            return res.json(requests);
        });
    },

    getRequest: function(req , res) {
        var requestId = req.params.requestId;

        if(requestId) {
            Request.findById(requestId, (err, request) => {
                if(err){
                    return res.json(err);
                }

                return res.json(request);
            });
        }
    },

    checkRequest: function(req, res) {
        var requestId = req.params.requestId;

        if(requestId) {
            Request.findById(requestId, (err, request) => {
                if(err){
                    return res.json(err);
                }

                request.status = 'Aprobada';
                request.checked = true;

                request.save((err, request) => {
                    if(err){
                        return res.json(err);
                    }

                    User.findById(req.user.sub, (err, user) => {
                        if(err){
                            return res.json(err);
                        }

                        user.checked = request.amount;
                        user.requested = user.requested - request.amount;
                         
                        user.save((err, user) => {
                            if(err) {
                                return res.json(err);
                            }

                            return res.json({
                                user,
                                request
                            });
                        })
                    });
                });
            });
        }
    }
}

module.exports = controller;