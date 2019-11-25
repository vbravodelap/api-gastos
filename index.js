'use strict'

var mongoose = require('mongoose');
var app = require('./app');
const chalk = require('chalk');
var port = process.env.PORT || 3001;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/controlgastos', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        app.listen( port, () => {
            console.log(chalk.blue('correct connection'));
        });

    }).catch( error => {

        console.log(chalk.red(error));
        
    });