var express = require('express');
var router = express.Router();
var db = require('../db.js');
var _ = require('underscore');
var error = require('../error-handlers');
var middleware = require('../middleware.js')(db);
var allRoute = router.route('/');
var idRoute = router.route('/:id');

allRoute
    .get(function (req, res) {
        middleware.requireAuthentication(req,res);
        db.candidate.findAll().then(function (candidates) {
            res.json(candidates);
        }, function () {
            error.serverError(res);
        })
    })
    .post(function (req, res) {
        middleware.requireAuthentication(req,res);
        var body = _.pick(req.body, 'name', 'managers');        
        db.candidate.create(body).then(function (candidate) {
            res.json(candidate.toJSON());
        }, function (errMsg) {
            error.badRequest(res,errMsg);
        });
    });

idRoute
    .get(function (req, res) {
        middleware.requireAuthentication(req,res);
        var candidateId = parseInt(req.params.id);
        db.candidate.findById(candidateId).then(function (candidate) {
            if (!!candidate) {
                res.json(candidate.toJSON());
            } else {                
                error.notFound(res,"No candidate with this id");
            }
        }, function () {
            error.serverError(res);
        });
    })
    .delete(function (req, res) {
        middleware.requireAuthentication(req,res);
        var candidateId = parseInt(req.params.id, 10);
        db.candidate.destroy({
            where: {
                id: candidateId
            }
        }).then(function (rowsDeleted) {
            if (rowsDeleted === 0) {                
                error.notFound(res,"No candidate with this id");
            } else {
                res.status(204).send();
            }
        }, function () {
            error.serverError(res);
        })
    })
    .put(function (req, res) {
        middleware.requireAuthentication(req,res);
        var candidateId = parseInt(req.params.id, 10);
        var body = _.pick(req.body, 'name', 'managers');
        var attributes = {};
        if (body.hasOwnProperty('name')) {            
            attributes.name = body.name;
        }
        if (body.hasOwnProperty('managers')) {
            attributes.managers = body.managers;
        }
        db.candidate.findById(candidateId).then(function (candidate) {
            if (candidate) {
                return candidate.update(attributes).then(function (candidate) {
                    res.json(candidate.toJSON());
                }, function (errMsg) {
                    error.badRequest(res,errMsg);
                })
            } else {
                error.notFound(res,"No candidate with this id");
            }
        }, function () {
            error.serverError(res);
        })
    });
module.exports = router;
