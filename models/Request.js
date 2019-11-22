'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = Schema({
    concept: String,
    description: String,
    amount: Number,
    status: String,
    checked: Boolean,
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = mongoose.model('Request', RequestSchema);