'use strict'

var express = require('express');
var UserController = require('../controllers/User');

var router = express.Router();

router.post('/store', UserController.store)

module.exports = router;