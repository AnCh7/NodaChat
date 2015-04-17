var express = require('express');
var app = express();

app.use(function (req, res, next) {
    if (req.url == '/test') {
        res.end('Test page');
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    res.send(404, "Not found");
});

app.listen(3000);