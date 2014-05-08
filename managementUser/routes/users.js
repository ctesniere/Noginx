var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* GET New User page. */
router.get('/new', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* GET Userlist page. */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/**
 * Service pour ajouter un nouveau user
 * url - /users/add
 * method - POST
 */
router.post('/add', function(req, res) {

    // req.db : internal DB variable

    // Get our form values. These rely on the "name" attributes
    var userName = req.db.body.username;
    var userEmail = req.db.body.useremail;

    // Set our collection
    var collection = req.db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("list");
            // And forward to success page
            res.redirect("list");
        }
    });
});

module.exports = router;
