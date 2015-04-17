var http = require('http');
var file = require('fs');
var server = new http.Server();

server.on('request', function (req, res) {
    'use strict'
    file.readFile('somefile.html', function (err, data) {
        if (err) throw err;
        res.end(data);
    });
});

module.exports = server;