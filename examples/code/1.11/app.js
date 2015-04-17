var http = require('http');
var file = require('fs');
var server = new http.Server();
server.listen(8080, 'localhost');

server.on('request', function (req, res) {
    'use strict'
    if (req.url === '/') {
        var data = file.readFileSync('index.html');
        res.end(data);
        /*file.readFile('index.html', function (err, data) {
            res.end(data);
        });*/
    }
});