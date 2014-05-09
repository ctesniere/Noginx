var express = require('express');
var router = express.Router();
var config = require('../config/config');
var users_connected = {};
var user = null;

/**
 * GET home page
 */
router.get('/', function(req, res) {
	if(user==null)
		res.render('connect', { title: 'Connexion' });
	else
		res.render('index', { title: 'Gestion des utilisateurs' });
});

router.post('/', function(req, res) {
	if(req.body.username!=null&&req.body.password!=null)
	{
		req.db.collection(config.mongo.table.userlist).find({ $and : [ {username:req.body.username}, {password:req.body.password} ] } ).toArray(function (err, items) {
		       if(items!=null && items.length>0)
		       {
			       items.forEach(function(item){
			       		users_connected[item.username] = item.username;
			       		user=item.username;
			       })
			       console.log(users_connected);
			       res.render('index', { title: 'Gestion des utilisateurs' });
			   }
			   else
			   {
			   		res.render('connect', { title: 'Connexion' });
			   }
		       
		});
		
	}
	else
		res.render('connect', { title: 'Connexion' });
});

router.get('/disconnect', function(req, res) {
	if(user!=null)
	{
		user=null;
		res.render('connect', { title: 'Connexion' });
	}
});

module.exports = router;
