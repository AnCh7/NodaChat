var winston = require('winston');
var path = require('path');

function getLogger(module) {
    'use strict';
    var label = module.filename.split('\\').slice(-2).join('\\');
    //add transports to logger
    return new winston.Logger({
        transports: [
            //print log messages to console
            new winston.transports.Console({
                colorize: true,
                label: label
            }),
            //print log messages to file
            new winston.transports.File({
                filename: 'logs/log.json'
            })
        ]
    });
}

module.exports = getLogger;
