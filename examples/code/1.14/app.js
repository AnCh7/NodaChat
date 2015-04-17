var fs = require('fs');

setImmediate(function () {
    console.log('setImmediate callback')
}, 0)

process.nextTick(function () {
    console.log('nextTick callback');
})

fs.open('index.html', 'r', function (err, data) {
    console.log('file');
});


