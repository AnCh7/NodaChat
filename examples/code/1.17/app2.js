var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Registration = function () {
    //call the base constructor
    EventEmitter.call(this);

    var _save = function (email, callback) {
        console.log('saving data');
        this.emit('saved', email);
    };
    var _send = function (email, callback) {
        console.log('sending email');
        if (false) {
            this.emit('error', new Error("unable to send email"));
        } else {
            this.emit('sent', email);
        }
    };
    var _success = function (email, callback) {
        this.emit('success', email);
    };
    //the only public method
    this.register = function (email, callback) {
        this.emit('beginRegistration', email);
    };
    //wire up our events
    this.on('beginRegistration', _save);
    this.on('saved', _send);
    this.on('sent', _success);
};
//inherit from EventEmitter
util.inherits(Registration, EventEmitter);


var registry = new Registration();
//if we didn't register for 'error', then the program would close when an error happened
registry.on('error', function (err) {
    console.log("Failed with error:", err);
});
//register for the success event
registry.on('success', function () {
    console.log("Success!");
});
//begin the registration
registry.register("john@example.com");