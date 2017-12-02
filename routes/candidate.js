var express = require('express');
var router = express.Router();
var db = require('../db.js');
var _ = require('underscore');
var middleware = require('../middleware.js')(db);
var allRoute = router.route('/');
var idRoute = router.route('/:id');

allRoute
    .get(function (req, res) {
        middleware.requireAuthentication(req,res);
        db.candidate.findAll().then(function (candidates) {
            res.json(candidates);
        }, function (e) {
            res.status(500).send();
        })
    })
    .post(function (req, res) {
        middleware.requireAuthentication(req,res);
        var body = _.pick(req.body, 'name', 'managers');        
        db.candidate.create(body).then(function (candidate) {
            res.json(candidate.toJSON());
        }, function (e) {
            res.status(400).json(e);
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
                res.status(404).send();
            }
        }, function (e) {
            res.status(500).send();
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
                res.status(404).json({
                    "error": 'No candidates with this id'
                })
            } else {
                res.status(204).send();
            }
        }, function () {
            res.status(500).send();
        })
    })
    .put(function (req, res) {
        middleware.requireAuthentication(req,res);
        var candidateId = parseInt(req.params.id, 10);
        var body = _.pick(req.body, 'name', 'managers');
        var attributes = {};
        if (body.hasOwnProperty('name')) {
            if (_.isString(body.name)) {
                body.name = body.name.trim();
            }
            attributes.name = body.name;
        }
        if (body.hasOwnProperty('managers')) {
            attributes.managers = body.managers;
        }
        db.candidate.findById(candidateId).then(function (candidate) {
            if (candidate) {
                return candidate.update(attributes).then(function (candidate) {
                    res.json(candidate.toJSON());
                }, function (e) {
                    res.status(400).json(e);
                })
            } else {
                res.status(404).send();
            }
        }, function () {
            res.status(500).send();
        })
    });

module.exports = router;
