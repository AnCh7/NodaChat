
var http = require('http');

var server = new http.Server();
server.listen(8080, 'localhost');

server.on('request', function (req, res) {
    'use strict'
    res.statusCode = 404;
    res.end('Not found');
});
