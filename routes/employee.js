var express = require('express');
var router = express.Router();
var db = require('../db.js');
var _ = require('underscore');
var error = require('../error-handlers');
var allRoute = router.route('/');
var idRoute = router.route('/:id');

allRoute
    /**
    * GET route to show all employees 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of all employees
    * @return {obj} res obj with internal server error
    */
    .get(function (req, res) {
        var token = req.get('Auth');                    
        db.user.findByToken(token).then(function (user) {
            db.employee.findAll().then(function (employees) {
                res.json(employees);
            }, function () {
                error.serverError(res);
            });                 
        }, function () {
            error.unauthorized(res);
        });
    })
    /**
    * POST route to add an employee 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the employee added
    * @return {obj} res obj with bad request error
    */
    .post(function (req, res) {     
        var token = req.get('Auth');   
        db.user.findByToken(token).then(function (user) {
            var body = _.pick(req.body, 'name');          
            db.employee.create(body).then(function (employee) {
                res.json(employee.toJSON());
            }, function (errMsg) {
                error.badRequest(res,errMsg);
            });
        }, function(){
            error.unauthorized(res);
        });
    });

idRoute
    /**
    * GET route to show a selected employee
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the selected employee
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    */
    .get(function (req, res) {
        var token = req.get('Auth');   
        db.user.findByToken(token).then(function (user) {  
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
        }, function(){
            error.unauthorized(res);
        });
    })
    /**
    * DELETE route to delete a selected employee
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with status of no content
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    */
    .delete(function (req, res) {
        var token = req.get('Auth');   
        db.user.findByToken(token).then(function (user) {     
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
            });
        }, function(){
            error.unauthorized(res);            
        });
    })
    /**
    * PUT route to update a selected employee
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the updated employees
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    * @return {obj} res obj with bad request error
    */
    .put(function (req, res) {
        var token = req.get('Auth');   
        db.user.findByToken(token).then(function (user) {  
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
        }, function(){
            error.unauthorized(res);
        })
    });
module.exports = router;