'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

// Rutas
var user_routes = require('./routes/User');
var request_routes = require('./routes/Request');

var app = express();

morgan.token('id', function getId (req) {
    return req.id
})

app.use(morgan(':id :method :url :response-time'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/api', user_routes);
app.use('/api', request_routes);

module.exports = app;