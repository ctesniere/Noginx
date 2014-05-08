var express = require('express');
var config = require('../config/config');
var router = express.Router();

/**
 * GET userlist
 */
router.get('/userlist', function(req, res) {
    req.db.collection(config.mongo.table.userlist).find().toArray(function (err, items) {
        res.json(items);
    });
});

/**
 * POST to adduser
 */
router.post('/adduser', function(req, res) {
    req.db.collection(config.mongo.table.userlist).insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * DELETE to deleteuser
 */
router.delete('/deleteuser/:id', function(req, res) {
    req.db.collection(config.mongo.table.userlist).removeById(req.params.id, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;