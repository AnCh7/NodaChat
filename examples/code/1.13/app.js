var http = require('http');
var file = require('fs');
var server = new http.Server();
server.listen(8080, 'localhost');

server.on('request', function (req, res) {
    'use strict'
    res.send('Hello, Node!');
});

setTimeout(function () {
    console.log('Hello, timer');
}, 3000)


setInterval(function () {
    console.log('Hello, interval');
}, 1000)