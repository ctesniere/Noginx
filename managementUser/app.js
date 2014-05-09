var express = require('express');
var io = require('socket.io');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('./config/config');

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://" + config.mongo.host + ":" + config.mongo.port + "/" + config.mongo.db, {native_parser:true});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
io = io.listen(app.listen(3001));

var usernames = {};

// Configuration du moteur de vue
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

// Fait de la db accessible à tous les routeurs
app.use(function(req,res,next){
    req.db = db;
    //console.log(req);

    if (req.cookies.user == null || req.cookies.user == '') {
        if (req.originalUrl != "/connect")
            res.redirect('/connect');
        else
            next();
    } else {
        next();
    }
});

app.use('/', routes);
app.use('/users', users);
app.get('/chat', function (req, res) {
  res.sendfile(__dirname + '/views/chat.html');
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// chat events
io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
        //var newMsg = {
        //    'username': socket.username,
        //    'message': data
        //}
        db.collection('userlist').update({username:socket.username}, {'$push':{message:data}}, function(err) {
        if (err) throw err;
        console.log('Updated!');
    });
        //db.collection(config.mongo.table.userlist).insert(newMsg, function(err, result){

    //});
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

module.exports = app;