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
 * Edition d'un user
 * url - /users/deleteuser/:id
 * method - GET
 */
router.get('/edit/:id', function(req, res) {
    var username;
    var fullname;
    var location;
    var email;
    var age;
    var gender;

    req.db.collection(config.mongo.table.userlist).find({"_id" : ObjectId(req.params.id)}).toArray(function (err, items) {

                console.log(items);

               if(items!=null && items.length>0)
               {
                   items.forEach(function(item){
                        username = item.username;
                        fullname = item.fullname;
                        location = item.location;
                        email = item.email;
                        age = item.age;
                        gender = item.gender;
                   })
                   res.render('edit', { title: 'Editer utilisateur',
                                        username:username,
                                        fullname:fullname,
                                        location:location,
                                        email:email,
                                        age:age,
                                        gender:gender,
                                        id:req.params.id});
               }
    });
});

/**
 * Edition d'un user
 * url - /users/deleteuser/:id
 * method - GET
 */
router.post('/edit', function(req, res) {

console.log(req.body);
    req.db.collection(config.mongo.table.userlist).update({_id: ObjectId(req.body.id)}, 

        {$set: {username:req.body.username,
      fullname:req.body.fullname,
      location:req.body.location,
      email:req.body.email,
      age:req.body.age,
      gender:req.body.gender}}, function(err) {
        if(err) {
            return console.log('update error', err);
        }
    });
/*
    req.db.collection(config.mongo.table.userlist).findAndModify({
    query: { _id: ObjectId(req.body.id)},
    sort: { rating: 1 },
    update: { $inc: { username:req.body.username,
      fullname:req.body.fullname,
      location:req.body.location,
      email:req.body.email,
      age:req.body.age,
      gender:req.body.gender } }
});
*/
/*
    req.db.collection(config.mongo.table.userlist).update(
   { _id: ObjectId(req.body.id) },
   {
      username:req.body.username,
      fullname:req.body.fullname,
      location:req.body.location,
      email:req.body.email,
      age:req.body.age,
      gender:req.body.gender
   },
   { upsert: true }
   );
*/
    
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
    req.db.collection(config.mongo.table.userlist).find({username : {$regex: req.body.username}}, {sort: [['username',1]]}).toArray(function(err, items) {
        if (err) throw err;
        res.render('search', {
            title : "Rechercher un utilisateur",
            items : items});
    });
});

module.exports = router;