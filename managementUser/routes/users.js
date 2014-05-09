var express = require('express');
var config = require('../config/config');
var router = express.Router();


var Model = {
    user : function(u) {
        u.created_on = new Date();
        return u;
    }
}

/**
 * Ajout d'un utilisateur
 * url - /users/new
 * method - GET
 */
router.get('/new', function(req, res) {
    res.render('usernew', {title : "Ajout d'un nouveau utilisateur"});
});

/**
 * Liste des utilisateurs
 * url - /users/userlist
 * method - GET
 */
router.get('/userlist', function(req, res) {
    req.db.collection(config.mongo.table.userlist).find().toArray(function (err, items) {
        if (err) throw err;
        res.json(items);
    });
});

/**
 * Ajout d'user
 * url - /users/adduser
 * method - GET
 */
router.post('/adduser', function(req, res) {

    req.db.collection(config.mongo.table.userlist).insert(req.body, function(err, result){
        if (err) throw err;
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * Suppression d'un user
 * url - /users/deleteuser/:id
 * method - DELETE
 */
router.delete('/deleteuser/:id', function(req, res) {
    req.db.collection(config.mongo.table.userlist).removeById(req.params.id, function(err, result) {
        if (err) throw err;
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/**
 * Affichage du formulaire de recherche
 * url - /users/search
 * method - GET
 */
router.get('/search', function(req, res) {
    res.render('search', {
        title : "Rechercher un utilisateur",
        items : {}});
});

/**
 * Recherche un utilisateur
 * url - /users/search
 * method - POST
 */
router.post('/search', function(req, res) {
    req.db.collection(config.mongo.table.userlist).find({username : {$regex: req.body.username}}, {sort: [['username',1]]}).toArray(function(err, items) {
        if (err) throw err;
        res.render('search', {
            title : "Rechercher un utilisateur",
            items : items});
    });
});

module.exports = router;