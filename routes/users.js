var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/users');
var bodyParser = require('body-parser');
var router = express.Router();

/* GET users listing. */
router.use(bodyParser.json());
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next){
  User.findOne({username : req.body.username})
  .then((user) =>{
    if(user != null){
      var err = new Error(`User ${req.body.username} already exists`);
      err.status = 403;
      return next(err);
    }
    else{
      return User.create({
        username: req.body.username,
        password: req.body.password
      })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({status : 'Registration Successful' , user: user});
      }, (err) => next(err))
      .catch((err) => next(err));
    }
  })
  .catch((err) => next(err));
});

router.post('/login' , function(req, res, next){
  if(!req.session.user){

    var authHeader = req.headers.authorization;

    if(!authHeader){
      var err = new Error('You are not authenticated');
      err.status = 401;
      res.setHeader('WWW-Authenticate' , 'Basic');
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(' ')[1] , "base64").toString().split(':');
    var username = auth[0];
    var password = auth[1];
    User.findOne({username: username})
    .then((user) =>{
      if(user === null){
        var err = new Error('You are not authenticated');
        err.status = 403;
        return next(err);
      }
      else if(password !== user.password){
        var err = new Error('You\'r password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if(user.username === username && user.password === password){
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'text/plain');
        res.end('You are authenticated');
      }
    }, (err) => next(err)).catch((err) => next(err));

  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type' , 'text/plain');
    res.end('You are already authenticated');
  }
});

router.get('/logout' , (req , res, next) =>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!')
    err.status = 403;
    return next(err);
  }
})
module.exports = router;
