var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('./config/config');

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://" + config.mongo.host + ":" + config.mongo.port + "/" + config.mongo.db, {native_parser:true});

var routes = require('./routes/index');
var chat = require('./routes/chat');
var users = require('./routes/users');

var app = express();

// Configuration du moteur de vue
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    // Fait de la db accessible à tous les routeurs
    req.db = db;

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
app.use('/chat', chat);

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

module.exports = app;