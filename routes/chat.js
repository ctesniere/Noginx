var express = require('express');
var config = require('../config/config');
var router = express.Router();

var usernames = {};

/**
 * Affiche le tchat
 * url - /chat
 * method - GET
 */
router.get('/', function (req, res) {
    var app = express();

    var io = require('socket.io');
    io = io.listen(app.listen(config.socket_io.port));
    io.sockets.on('connection', function (socket) {
        socket.on('sendchat', function (data) {
            io.sockets.emit('updatechat', socket.username, data.message);

            req.db.collection(config.mongo.table.userlist).update({username:socket.username}, {'$push':{message:data}}, function(err) {
                if (err) throw err;
            });
        });

        socket.on('adduser', function(username){
            socket.username = username;
            usernames[username] = username;
            socket.emit('updatechat', 'SERVER', 'Connected');
            socket.broadcast.emit('updatechat', 'SERVER', username + ' has joined');
            io.sockets.emit('updateusers', usernames);
        });

        socket.on('disconnect', function(){
            delete usernames[socket.username];
            io.sockets.emit('updateusers', usernames);
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has left');
        });
    });
    res.sendfile('./views/chat.html');
});

module.exports = router;