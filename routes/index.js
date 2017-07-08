var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Test = require('../models/test');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '3DS' });
});

router.get('/login', function(req,res,next){
  res.render('login', {title: 'Login Page'});
});

router.get('/xcode', function(req, res, next){
  res.render('xcode', {title: 'Xcode Page'});
});

router.post('/login', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var favorite = req.body.favorite;

    var newUser = User({
        name: name,
        email: email,
        favorite: favorite,
    });

    // Save the user
    newUser.save(function(err) {
        if (err) console.log(err);

        res.send('User created!');
    });
});

router.post('/xcode', function(req, res, next){
  var one = req.body.one;
  console.log('One: ',one);
  var newTest = Test({
    one: one
  });

  newTest.save(function(err){
    if (err) console.log(err);

    res.send('Test created!');
  })
  res.json({two: 2});
});

module.exports = router;
