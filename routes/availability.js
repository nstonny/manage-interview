var express = require('express');
var router = express.Router();
var db = require('../db.js');
var _ = require('underscore');
var error = require('../error-handlers');
var middleware = require('../middleware.js')(db);
var allRoute = router.route('/');
var idRoute = router.route('/:id');

allRoute
    /**
    * GET route to show all availabilities 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of all availabilities
    * @return {obj} res obj with internal server error
    */    
    .get(function (req, res) {
        middleware.requireAuthentication(req,res);
        db.availability.findAll().then(function (availabilities) {
            res.json(availabilities);
        }, function () {
            error.serverError(res);
        });
    })
    /**
    * POST route to add an availability 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the availability added
    * @return {obj} res obj with bad request error
    * @return {obj} res obj with employee not found error 
    */
    .post(function (req, res) {
        middleware.requireAuthentication(req,res);
        var employeeId = parseInt(body.employeeId);
        var body = _.pick(req.body, 'day', 'time');
        db.availability.create(body).then(function (availability) {
            db.employee.findById(employeeId).then(function (employee) {
                if (employee) {
                    employee.addAvailability(availability).then(function () {
                        return availability.reload();
                    }).then(function () {
                        res.json(availability.toJSON());
                    });
                } else {
                    error.notFound(res,"No employee with this id");
                }
            });
        }, function (errMsg) {
            error.badRequest(res,errMsg);
        });
    });

idRoute
    /**
    * GET route to show a selected availabilities of a selected employee
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the availabilities
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    */    
    .get(function (req, res) {
        middleware.requireAuthentication(req,res);
        var employeeId = parseInt(req.params.id);
        db.employee.findById(employeeId).then(function (employee) {
            if (employee) {
                employee.getAvailabilities().then(function (availabilities) {
                    res.json(availabilities);
                });
            } else {
                error.notFound(res,"No employee with this id");
            }
        }, function (e) {
            error.serverError(res);
        });
    })
    /**
    * DELETE route to delete a selected availability
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with status of no content
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    */
    .delete(function (req, res) {
        middleware.requireAuthentication(req,res);
        var availabilityId = parseInt(req.params.id);
        db.availability.destroy({
            where: {
                id: availabilityId
            }
        }).then(function (rowsDeleted) {
            if (rowsDeleted === 0) {
                error.notFound(res,"No availability with this id");
            } else {
                res.status(204).send();
            }
        }, function () {
            error.serverError(res);
        });
    })
    /**
    * PUT route to update a selected availability
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the updated availability
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    * @return {obj} res obj with bad request error
    */
    .put(function (req, res) {
        middleware.requireAuthentication(req,res);
        var availabilityId = parseInt(req.params.id, 10);
        var body = _.pick(req.body, 'day', 'time');
        var attributes = {};
        if (body.hasOwnProperty('day')) {
            attributes.day = body.day;
        }
        if (body.hasOwnProperty('time')) {
            attributes.time = body.time;
        }
        db.availability.findOne({
            where: {
                id: availabilityId
            }
        }).then(function (availability) {
            if (availability) {
                availability.update(attributes).then(function (availability) {
                    res.json(availability.toJSON());
                }, function (errMsg) {
                    error.badRequest(res,errMsg);
                });
            } else {
                error.notFound(res,"No availability with this id");
            }
        }, function () {
            error.serverError(res);
        });
    });
module.exports = router;