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
        db.employee.findAll().then(function (employees) {
            res.json(employees);
        }, function () {
            error.serverError(res);
        });
    })
    .post(function (req, res) {
        middleware.requireAuthentication(req,res);    
        var body = _.pick(req.body, 'name');            
        db.employee.create(body).then(function (employee) {
            res.json(employee.toJSON());
        }, function (errMsg) {
            error.badRequest(res,errMsg);
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
                error.notFound(res,"No employee with this id");
            }
        }, function () {
            error.serverError(res);
        });
    })
    .delete(function (req, res) {
        middleware.requireAuthentication(req,res);    
        var employeeId = parseInt(req.params.id, 10);
        db.availability.destroy({
            where: {
                employeeId: employeeId
            }
        });
        db.employee.destroy({
            where: {
                id: employeeId
            }
        }).then(function (rowsDeleted) {
            if (rowsDeleted === 0) {
                error.notFound(res,"No employee with this id");
            } else {
                res.status(204).send();
            }
        }, function () {
            error.serverError(res);
        })
    })
    .put(function (req, res) {
        middleware.requireAuthentication(req,res);    
        var employeeId = parseInt(req.params.id, 10);
        var body = _.pick(req.body, 'name');
        var attributes = {};
        if (body.hasOwnProperty('name')) {            
            attributes.name = body.name;
        }
        db.employee.findById(employeeId).then(function (employee) {
            if (employee) {
                return employee.update(attributes).then(function (employee) {
                    res.json(employee.toJSON());
                }, function (errMsg) {
                    error.badRequest(res,errMsg);
                })
            } else {
                error.notFound(res,"No employee with this id");
            }
        }, function () {
            error.serverError(res);
        })
    });
module.exports = router;