var Nedb = require("nedb");
var sanitize = require("validator");

module.exports = function() {

    "use strict";
    var db = new Nedb({ filename: __dirname + "/storage.json", autoload: true });

    function escape(str) {
        var value = sanitize.escape(str);
        return sanitize.escape(value).trim();
    }

    function saveUser(nickname, password, callback) {
        nickname = escape(nickname);
        db.insert({
            nickname: nickname,
            password: password
        }, function(err, newDoc) {
            if (err) {
                callback(err);
            } else {
                callback(null, newDoc);
            }
        });
    }

    function findUser(nickname, callback) {
        db.find({ nickname: nickname }, function(err, docs) {
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