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
    * GET route to show all candidates 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of all candidates
    * @return {obj} res obj with internal server error
    */
    .get(function (req, res) {
        var token = req.get('Auth');                    
        db.user.findByToken(token).then(function (user) {
            db.candidate.findAll().then(function (candidates) {
                res.json(candidates);
            }, function () {
                error.serverError(res);
            })
        }, function(){
            error.unauthorized(res);
        });
    })
    /**
    * POST route to add a candidate 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the candidate to be added
    * @return {obj} res obj with bad request error
    */
    .post(function (req, res) {
        var token = req.get('Auth');                    
        db.user.findByToken(token).then(function (user) {
            var body = _.pick(req.body, 'name', 'managers');        
            db.candidate.create(body).then(function (candidate) {
                res.json(candidate.toJSON());
            }, function (errMsg) {
                error.badRequest(res,errMsg);
            });
        }, function(){
            error.unauthorized(res);
        });
    });

idRoute
    /**
    * GET route to show a selected candidate
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the selected candidate
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    */
    .get(function (req, res) {
        var token = req.get('Auth');                    
        db.user.findByToken(token).then(function (user) {
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
        }, function(){
            error.unauthorized(res);
        });
    })
    /**
    * DELETE route to delete a selected candidate
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
        }, function(){
            error.unauthorized(res);
        })
    })
    /**
    * PUT route to update a selected candidate
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of the updated candidate
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    * @return {obj} res obj with bad request error
    */
    .put(function (req, res) {
        var token = req.get('Auth');                    
        db.user.findByToken(token).then(function (user) {
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
        }, function(){
            error.unauthorized(res);
        })
    });
module.exports = router;
