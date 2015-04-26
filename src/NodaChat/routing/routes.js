var validator = require("express-validator");

module.exports = function (app, io, dataAccess) {
    
    "use strict";
    
    var db = new dataAccess();
    
    function authorize(email, password, callback) {
        console.log("Login attempt: " + email + ", " + password);
        db.findUser(email, function (err, data) {
            if (err) {
                callback(err);
            } else if (data.length === 0) {
                console.log("Register attempt: " + email + ", " + password);
                db.saveUser(email, password, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log("User saved");
                        callback(null, data);
                    }
                });
            } else {
                callback(null, data);
            }
        });
    }
    
    app.get("/", function (req, res) {
        res.render("index");
    });
    
    app.post("/login", function (req, res, next) {
        
        req.assert('email', 'Incorrect email address').isEmail();
        req.assert('password', 'Password is required').notEmpty();
        
        var errors = req.validationErrors();
        if (errors) {
            var response = { success: false, data: errors };
            res.json(response);
        } else {
            authorize(req.body.email, req.body.password, function (err, data) {
                if (err) {
                    return next(err);
                }
                var response = { success: true, data: data };
                res.json(response);
            });
        }
    });
    
    app.get("/db", function (req, res, next) {
        db.findAll(function (err, data) {
            if (err) {
                return next(err);
            } else {
                res.json(data);
            }
        });
    });
};