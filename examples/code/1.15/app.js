var http = require('http');
var file = require('fs');
var server = new http.Server();

server.on('request', function (req, res) {
    'use strict'
    try {
        file.readFile('somefile.html', function (err, data) {
            if (err) throw err;
            res.end(data);
        });
    } catch (err) {
        console.log('Error occurred', err);
    }
});

server.listen(8080, 'localhost');