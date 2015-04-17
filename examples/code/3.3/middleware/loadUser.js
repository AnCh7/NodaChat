//preload user on every request
module.exports = function (req, res, next) {
    'use strict';
    req.user = res.locals.user = req.session.user;
    next();
}

