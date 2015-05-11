/**
 * Created by Fer on 11/05/2015.
 */
var uuid = require('node-uuid');
var connections = {};
var io;

exports.init = function(app) {
    var server = require('http').Server(app);
    io = require('socket.io')(server);

    app.use(function(req, res, next) {
        if (!req.user) {
            return next();
        }
        if (!req.session.connectionID) {
            req.session.connectionID = uuid.v4();
        }
        connections[req.session.connectionID] = req.user._id;
        next();
    });

    io.on('connection', function (socket) {
        socket.on('authenticate', function (connectionID) {
            socket.join('user:' + connections[connectionID]);
            console.log('added user to room user:' + connections[connectionID]);
        });
    });

    return server;
};

exports.sendTo = function(userID, eventType, data) {
    'use strict';
    io.to('user:' + userID).emit(eventType, data);
    io.emit('change', 'asdf');
};