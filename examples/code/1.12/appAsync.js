var http = require('http');
var file = require('fs');
var server = new http.Server();

server.on('request', function (req, res) {
    'use strict'
    if (req.url === '/') {
        file.readFile('index.html', function (err, data) {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.end("Error occurred");
                return;
            }
            res.end(data);
        });
    }
});

server.listen(8080, 'localhost');