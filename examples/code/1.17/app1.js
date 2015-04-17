var Registration = function () {
    'use strict'
    var _save = function (email, callback) {
        console.log('saving data');
        setTimeout(function () {
            callback(null);
        }, 20);
    };
    var _send = function (email, callback) {
        console.log('sending email');
        setTimeout(function () {
            callback(new Error("Failed to send"));
        }, 20);
    };
    this.register = function (email, callback) {
        _save(email, function (err) {
            if (err)
                return callback(err);
            _send(email, function (err) {
                callback(err);
            });
        });
    };
};

var registry = new Registration();
registry.register("john@example.com", function (err) {
    console.log("done", err);
});