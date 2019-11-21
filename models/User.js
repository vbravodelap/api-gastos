'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    requested: Number,
    checked: Number,
    role: String
});

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;

    return obj;
}

module.exports = mongoose.model('User', UserSchema);