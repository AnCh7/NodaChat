var EventEmitter = require('events').EventEmitter;

var event = new EventEmitter();

event.on('custom_event', function () {
    console.log("Custom event occurred");
})

event.on('custom_event', function (data) {
    console.log("Yet another event handler", data);
});

event.emit('custom_event', {event_data: "hello"});

//console.log(event);