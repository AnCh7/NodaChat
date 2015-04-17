var http = require('http');

var server = new http.Server();
var url = require('url');

server.listen(8080, 'localhost');

server.on('request', function (req, res) {
    'use strict'
    console.log(req.method, req.url);
    var urlParsed = url.parse(req.url, true);
    if (urlParsed.pathname === '/test') {
        res.end('Hello, Node!');
    } else {
        res.end('Not found');
    }
});
