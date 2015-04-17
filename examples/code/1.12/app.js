var http = require('http');
var file = require('fs');
var server = new http.Server();
server.listen(8080, 'localhost');

server.on('request', function (req, res) {
    'use strict'
    if (req.url === '/') {
        try {
            var data = file.readFileSync('index.html');
            res.end(data);
        } catch (err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Error occurred");
        }
    }
});