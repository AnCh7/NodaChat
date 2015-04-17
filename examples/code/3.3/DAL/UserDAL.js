var sanitize = require('validator');

module.exports = function () {
    'use strict';
    function authorize(username, password, callback) {
        username = escape(username);
        if (username === 'admin' || username === 'user') {
            callback(null, username);
        } else {
            var err = new Error('Invalid credentials');
            err.status = 401;
            callback(err);
        }
        /*async.waterfall([
         function (callback) {
         User.findOne({login: username}, callback);
         },
         function (user, callback) {
         if (user) {
         return callback(null, user);
         }
         User.findOne({email: username}, callback);
         },
         function (user, callback) {
         if (user) {
         if (user.checkPassword(password)) {
         if (user.isBlocked) {
         return callback(new AuthError('Your account is blocked'));
         }
         callback(null, user);
         } else {
         callback(new AuthError("Incorrect credentials"));
         }
         } else {
         callback(new AuthError("Incorrect credentials"));
         }
         }
         ],
         function (err, user) {
         if (err) {
         if (err instanceof AuthError) {
         return callback(err);
         }
         callback(new AuthError('Some error occured during registration'));
         log.error(err);
         return;
         }
         callback(null, user);
         user.updateLastLoggedIn();
         });*/
    }

    function escape(value) {
        var value = sanitize.escape(value);
        return sanitize.escape(value).trim();
    }

    return {
        authorize: authorize
    };
};
