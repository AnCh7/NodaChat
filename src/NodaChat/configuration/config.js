var util = require('util');
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var socketio = require("socket.io");
var validator = require("express-validator");

module.exports = function(app) {

    var port = process.env.PORT || 8080;
    var io = socketio.listen(app.listen(port));
    console.log("Application is running on http://localhost:" + port);

    app.set("view engine", "jade");
    app.set("views", path.join(__dirname, "/../views"));

    app.use(express.static(path.join(__dirname, "/../public")));

    app.use(favicon(__dirname + "/../public/favicons/favicon.ico"));

    app.use(logger("dev"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(validator());

    app.use(cookieParser());

    require(path.join(__dirname, "/../websockets/sockets.js"))(app, io);
    var dataAccess = require(path.join(__dirname, "/../database/dataAccess.js"));
    require(path.join(__dirname, "/../routing/routes.js"))(app, io, dataAccess);
};