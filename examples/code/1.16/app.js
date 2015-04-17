var domain = require('domain');
var server = require('./server');
var file = require('fs');

var appDomain = domain.create();

appDomain.on('error', function (err) {
    console.log('Error occurred' + err);
});

appDomain.run(function () {
    file.readFile('somefile.html', function (err, data) {
        if (err) throw err;
        res.end(data);
    });
});


