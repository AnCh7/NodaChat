var http = require('http');
var url = require('url');
var logger = require('./log')(module);

var server = new http.Server();
server.listen(8080, 'localhost');

server.on('request', function (req, res) {
    'use strict'
    logger.info(req.method, req.url);
    var urlParsed = url.parse(req.url, true);
    if (urlParsed.pathname === '/test') {
        res.end('Hello, Node!');
    } else {
        logger.error('page not found');
        res.statusCode = 404;
        res.end('Not found');
    }
});

logger.info('Server is running');
