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
        db.employee.findAll().then(function (employees) {
            res.json(employees);
        }, function (e) {
            res.status(500).send();
        });
    })
    .post(function (req, res) {
        middleware.requireAuthentication(req,res);    
        var body = _.pick(req.body, 'name');            
        db.employee.create(body).then(function (employee) {
            res.json(employee.toJSON());
        }, function (e) {
            res.status(400).json(e);
        });
    });

idRoute
    .get(function (req, res) {
        middleware.requireAuthentication(req,res);    
        var employeeId = parseInt(req.params.id, 10);
        db.employee.findById(employeeId).then(function (employee) {
            if (!!employee) {
                res.json(employee.toJSON());
            } else {
                res.status(404).send();
            }
        }, function (e) {
            res.status(500).send();
        });
    })
    .delete(function (req, res) {
        middleware.requireAuthentication(req,res);    
        var employeeId = parseInt(req.params.id, 10);
        db.employee.destroy({
            where: {
                id: employeeId
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
        var employeeId = parseInt(req.params.id, 10);
        var body = _.pick(req.body, 'name');
        var attributes = {};
        if (body.hasOwnProperty('name')) {
            if (_.isString(body.name)) {
                body.name = body.name.trim();
            }
            attributes.name = body.name;
        }
        db.employee.findById(employeeId).then(function (employee) {
            if (employee) {
                return employee.update(attributes).then(function (employee) {
                    res.json(employee.toJSON());
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