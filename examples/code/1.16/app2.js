var http = require('http');
var domain = require('domain');
var serverDomain = domain.create();
var file = require('fs');

serverDomain.on('error',function(err){
    console.log('Top level domain handler')
})

serverDomain.run(function() {
    // server is created in the scope of serverDomain
    http.createServer(function(req, res) {
        // req and res are also created in the scope of serverDomain
        // however, we'd prefer to have a separate domain for each request.
        // create it first thing, and add req and res to it.
        var reqd = domain.create();
        reqd.add(req);
        reqd.add(res);
        reqd.on('error', function(er) {
            console.log('Request domain handler');
            try {
                res.writeHead(500);
                res.end('Error occurred, sorry.');
            } catch (er) {
                console.error('Error sending 500', er, req.url);
            }
            serverDomain.emit('error',er);
        });
        reqd.run(function(){
            file.readFile('somefile.html', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        })

    }).listen(1337);
});