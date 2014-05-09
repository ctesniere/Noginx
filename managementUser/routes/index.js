var express = require('express');
var router = express.Router();
var config = require('../config/config');
var user = null;

/**
 * GET home page
 */
router.get('/', function (req, res) {
    res.render('index', { title: 'Liste des utilisateurs' });
});

/**
 * Affiche le formulaire de connection
 * url - /connect
 * method - GET
 */
router.get('/connect', function (req, res) {
    res.render('connect', {
        title: 'Connexion',
        error: ''
    });
});

/**
 * Process de connection
 * url - /connect
 * method - POST
 */
router.post('/connect', function (req, res) {
    console.log(req.body.username)
    console.log(req.body.username);
    console.log(req.body.password);
    if (req.body.username && req.body.password) {
        req.db.collection(config.mongo.table.userlist)
                .findOne({ $and: [{username: req.body.username}, {password: req.body.password}]}, function(err, item) {
            if (err != null || item != null) {
                res.cookie('user', item, { maxAge: config.cookie.maxAge, httpOnly: true });
                res.redirect('/');
            } else {
                res.render('connect', {
                    title: 'Connexion',
                    error: 'Utilisateur introuvable'
                });
            }
        });
    } else {
        res.render('connect', {
            title: 'Connexion',
            error: 'Remplir tous les champs'
        });
    }
});

/**
 * Deconnection
 * url - /disconnect
 * method - GET
 */
router.get('/disconnect', function (req, res) {
    res.cookie('user', '', { maxAge: config.cookie.maxAge, httpOnly: true });
    res.redirect('/');
});

/**
 * POST to newMsg
 */
router.post('/newMsg', function (req, res) {
    req.db.collection(config.mongo.table.messages).insert(req.body, function (err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


module.exports = router;
