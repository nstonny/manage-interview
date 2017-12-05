
var express = require('express');
var router = express.Router();
var db = require('../db.js');
var error = require('../error-handlers');
var route = router.route('/:id');

route
    /**
    * GET route to show timeslots 
    *
    * @param {obj} req req obj 
    * @param {obj} res res obj 
    * @return {obj} res obj with json data of all availabilities for the candidate
    * @return {obj} res obj with not found error 
    * @return {obj} res obj with internal server error
    */
    .get(function (req, res) {
        var token = req.get('Auth');                    
        db.user.findByToken(token).then(function (user) {
            var candidateId = parseInt(req.params.id);
            var where = {};
            db.candidate.findById(candidateId).then(function (candidate) {
                if (!!candidate) {
                    var string = candidate.managers;
                    candidate.managers = string.replace(/, +/g, ",").split(",").map(Number);
                    where.employeeId = {
                        $in: [candidate.managers]
                    };
                    db.availability.findAll({
                        where: where
                    }).then(function (availabilities) {
                        if (availabilities.length === 0) {
                            error.notFound(res,"No available timeslot for next week for this candidate");
                        } else {
                            res.json(availabilities);
                        }
                    });
                } else {
                    error.notFound(res,"No candidate with this id");
                }
            }, function (e) {
                error.serverError(res);
            });
        }, function(){
            error.unauthorized(res);
        })
    });

module.exports = router;

