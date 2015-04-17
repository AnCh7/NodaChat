var express = require('express');
var app = express();

app.use(function (req, res, next) {
    if (req.url == '/test') {
        next(new Error('test page opened'));
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    res.send(202, "OK");
});

app.use(function (err, req, res, next) {
    console.log('error occurred');
    res.send(500, "Some error occurred");
})

app.listen(3000);