var express = require('express');
var router = express.Router();
var allRoute = router.route('/');
var loginRoute = router.route('/login');
var db = require('../db.js');
var _ = require('underscore');
var error = require('../error-handlers');
var bcrypt = require('bcrypt');

allRoute
    /**
    * POST route to add a user 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the user added
    * @return {obj} res obj with bad request error
    */
    .post(function (req, res) {
        var body = _.pick(req.body, 'email', 'password');
        db.user.create(body).then(function (user) {
            res.json(user.toPublicJSON());
        }, function (errMsg) {
            error.badRequest(res,errMsg);
        });
    });

loginRoute
    /**
    * POST route to login a user 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the user logged in 
    * and with 'Auth' token in res header 
    * @return {obj} res obj with unauthorized error
    */
    .post(function (req, res) {
        var body = _.pick(req.body, 'email', 'password');
        db.user.authenticate(body).then(function (user) {
            var token = user.generateToken('authentication');
            if (token) {
                res.header('Auth', token).json(user.toPublicJSON());
            }else{
                error.unauthorized(res);
            }
        }, function () {
            error.unauthorized(res);            
        });
    })
module.exports = router;
