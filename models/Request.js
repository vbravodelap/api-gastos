'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = Schema({
    concept: String,
    description: String,
    amount: Number,
    status: String,
    checked: Boolean,
    date: { Type: Date, default: Date.now },
    user: { Type: Schema.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Request', RequestSchema);