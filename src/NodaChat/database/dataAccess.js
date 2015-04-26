var Nedb = require("nedb");

module.exports = function() {

    "use strict";
    var db = new Nedb({ filename: __dirname + "/storage.json", autoload: true });

    function saveUser(email, password, callback) {
        db.insert({
            email: email,
            password: password
        }, function(err, newDoc) {
            if (err) {
                callback(err);
            } else {
                callback(null, newDoc);
            }
        });
    }

    function findUser(email, callback) {
        db.find({ email: email }, function(err, docs) {
            if (err) {
                callback(err);
            } else {
                callback(null, docs);
            }
        });
    }

    function findAll(callback) {
        db.find({}, function(err, docs) {
            if (err) {
                callback(err);
            } else {
                callback(null, docs);
            }
        });
    }

    return {
        saveUser: saveUser,
        findUser: findUser,
        findAll: findAll
    };
};