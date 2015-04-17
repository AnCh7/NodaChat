var async = require('async');

var Registration = function () {
    'use strict'
    var _save = function (email, callback) {
        console.log('saving data');
        callback(null, email);
    };
    var _send = function (email, callback) {
        console.log('sending email');
        callback(null, email);
    };

    this.register = function (email, cb) {
        async.waterfall([
            function (callback) {
                console.log('starting registration');
                callback(null, email);
            },
            _save,
            _send
        ], cb);
    };
};

var registry = new Registration();
registry.register("john@example.com", function (err, email) {
    console.log("done", err, email);
});