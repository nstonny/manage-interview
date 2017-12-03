var express = require('express');
var router = express.Router();
var allRoute = router.route('/');
var loginRoute = router.route('/login');
var db = require('../db.js');
var _ = require('underscore');
var error = require('../error-handlers');
var bcrypt = require('bcrypt');

allRoute
    .post(function (req, res) {
        var body = _.pick(req.body, 'email', 'password');
        db.user.create(body).then(function (user) {
            res.json(user.toPublicJSON());
        }, function (errMsg) {
            error.badRequest(res,errMsg);
        });
    });

loginRoute
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
