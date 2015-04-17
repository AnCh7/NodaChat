var express = require('express');
var UserDAL = require('../DAL/UserDAL');

var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { name: 'Express' });
});

router.post('/logon', function (req, res, next) {
    'use strict';
    var username = req.body.username,
        password = req.body.password;
    console.log('Login attempt: ' + username + ', ' + password);
    var dal = new UserDAL();
    dal.authorize(username, password, function (err, user) {
        if (err) {
            return next(err);
        }
        req.session.user = user;
        res.locals.user = user;
        res.redirect('/secure');
    });
});

router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
})


router.get('/secure', checkAuth, function (req, res) {
    res.render('secure');
});

//Is used to check if user is authorized
function checkAuth(req, res, next) {
    if (!req.session.user) {
        var error = new Error("Unauthorized access");
        error.status = 403;
        next(error);
    } else {
        next();
    }
}
module.exports = router;
