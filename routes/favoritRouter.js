const express = require('express');
const authenticate = require('../authenticate');
const mongoose = require('mongoose');
const Favorits = require('../models/favorits');
const bodyParser = require('body-parser');

const checkUser = (req, res, next) => {
    Favorits.findOne({user : req.user._id})
    .then((favorits) => {
        if(favorits != null){
            res.locals.favorits = favorits;
            return next(); 
        }
        else if (favorits === null &&  (req.method === 'GET' || req.method ==='DELETE')){
            var err = new Error('You don\'t have the favorits list');
            err.statusCode = 404;
            return next(err);
        }
        else if(favorits === null && req.method === 'POST'){
            Favorits.create({user : req.user._id}).then((favorits) => {
                res.locals.favorits = favorits;
                return next();
            })
        }
    }, (err) => next(err))
    .catch((err) => next(err));
};

const favoritRouter = express.Router();

favoritRouter.use(bodyParser.json());

favoritRouter.route('/')
.get(authenticate.verifyUser, checkUser, (req, res, next) => {
    Favorits.findOne({user : req.user._id}).populate('user').populate('dishes')
    .then((favorits) => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(favorits);
    })
})
.post(authenticate.verifyUser,checkUser, (req, res, next) => {
        favorits = res.locals.favorits;
        console.log(req.body.length);
        for( i = 0 ; i < req.body.length ; i++){
            console.log("i="+i);
            console.log(favorits.dishes.indexOf(req.body[i]._id));
            if(favorits.dishes.indexOf(req.body[i]._id) === -1){
                    favorits.dishes.push(req.body[i]._id);
                    console.log(favorits.dishes);
            }
        }
        favorits.save().then((favorits)=> {
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'appplication/json');
            res.json(favorits);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(authenticate.verifyUser, checkUser , (req, res, next) => {
        favorits = res.locals.favorits;
        favorits.remove().then((favorits) => {
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'appplication/json');
            res.json(favorits);
        }, (err) => next(err))
        .catch((err) => next(err));
})

favoritRouter.route('/:dishId')
.post(authenticate.verifyUser, checkUser, (req, res, next) => {
    favorits = res.locals.favorits;
        if(favorits.dishes.indexOf(req.params.dishId) !== -1){
                var err = new Error('This dish already exits in your favorits list!')
                return next(err);
        }
        else{
            favorits.dishes.push(req.params.dishId);
            favorits.save()
            .then((favorits) => {
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'appplication/json');
                res.json(favorits);
            })
            .catch((err) => next(err));
        }

})
.delete(authenticate.verifyUser, checkUser, (req, res, next) => {
    favorits = res.locals.favorits;
    console.log(favorits.dishes[0]);
    var index = favorits.dishes.indexOf(req.params.dishId);
    console.log(favorits.dishes[index]);
    favorits.dishes.splice(index,1);
    favorits.save()
    .then((favorits) => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'appplication/json');
        res.json(favorits);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = favoritRouter;