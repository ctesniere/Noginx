var express = require('express');
var config = require('../config/config');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

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
router.get('/list', function(req, res) {
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
router.post('/add', function(req, res) {
    // TODO Vérifier si l'user existe déjà en BDD
    // TODO Vérifier si toutes les données importantes sont saisie
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
 * Affichage de la page d'edition d'un user
 * url - /users/edit/:id
 * method - GET
 */
router.get('/edit/:id([0-9a-f]{24})', function(req, res) {
    req.db.collection(config.mongo.table.userlist).findOne({"_id" : ObjectId(req.params.id)}, function(err, item) {
        console.log(item);
        res.render('edit', {
            title: 'Editer utilisateur',
            item:item});
        });
});

/**
 * Edition d'un user
 * url - /users/deleteuser/:id
 * method - GET
 */
router.post('/edit', function(req, res) {
    req.db.collection(config.mongo.table.userlist).update({_id: ObjectId(req.body.id)}, {$set: {
        username:req.body.username,
        fullname:req.body.fullname,
        location:req.body.location,
        email:req.body.email,
        age:req.body.age,
        password:req.body.password,
        gender:req.body.gender}}, function(err) {
        if(err) {
            return console.log('update error', err);
        }
    });

    res.render('index', { title: 'Gestion des utilisateurs' });
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
    console.log(req.body);
    req.db.collection(config.mongo.table.userlist).find(
        { $and: [
            {username : {$regex: req.body.username}},
            {email :{$regex: req.body.email}}]},
        {sort: [['username',1]]})
        .toArray(function(err, items) {
            if (err) throw err;
            res.json(items);
    });
});

module.exports = router;