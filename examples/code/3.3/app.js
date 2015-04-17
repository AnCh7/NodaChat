var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    name: 'my_sess',
    secret: 'encrypted_secret_key'
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(require('./middleware/loadUser'));
require('./routes/configure')(app);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        var status = err.status || 500
        err.status = status;
        res.status(status);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    var status = err.status || 500;
    err.status = status;
    res.status(status);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
