
var express = require('express');
var router = express.Router();
var db = require('../db.js');
var error = require('../error-handlers');
var middleware = require('../middleware.js')(db);
var route = router.route('/:id');

route
    .get(function (req, res) {
        middleware.requireAuthentication(req,res);
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
    });

module.exports = router;

