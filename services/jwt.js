'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
const SECRET_KEY = 'pJaReaow0RHNjj7NQriypOPxANN58krjQCtuFBjSKtMzNpLxob7vaXKF54Hxzy6Bv314KL7Qt7G0bwIwCHCHedZuq6LEIOcgTVjm';

exports.createToken = function(user) {
    var payload = {
        sub: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        requested: user.requested,
        checked: user.checked,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }

    return jwt.encode(payload, SECRET_KEY);
}