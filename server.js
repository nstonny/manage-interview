var express = require('express');
var bodyParser = require('body-parser');
var _ =  require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//..................... GET requests .........................
app.get('/', function(req, res){
    res.send('Welcome to manage interview app');
}); 
//GET all employees
app.get('/employees', function(req, res){
    db.employee.findAll().then(function (employees) {
        res.json(employees);
    }, function (e) {
        res.status(500).send();
    });        
});

//GET all candidates
app.get('/candidates', function(req, res){
    db.candidate.findAll().then(function(candidates){
        res.json(candidates);
    }, function(e){
        res.status(500).send();
    })    
});

//GET all availabilities
app.get('/availabilities', function(req, res){    
        db.availability.findAll().then(function (availabilities) {
            res.json(availabilities);
        }, function (e) {
            res.status(500).send();
        });
    });

//GET employee by id
app.get('/employees/:id', function(req, res){
    var employeeId = parseInt(req.params.id, 10);
    db.employee.findById(employeeId).then(function(employee){
        if(!!employee){
            res.json(employee.toJSON());
        }else{
            res.status(404).send();
        }
    }, function(e){
        res.status(500).send();
    });       
});

//GET availabilities by employee id
app.get('/availabilities/:id', function(req,res){
    var employeeId = parseInt(req.params.id);
    db.employee.findById(employeeId).then(function (employee) {
        employee.getAvailabilities().then(function (availabilities) {
            res.json(availabilities);
        });
    });
});

//GET candidate by id
app.get('/candidates/:id', function(req,res){
    var candidateId = parseInt(req.params.id);

    db.candidate.findById(candidateId).then(function(candidate){
        if(!!candidate){
            res.json(candidate.toJSON());
        }else{
            res.status(404).send();
        }

    }, function(e){
        res.status(500).send();

    });     
});
//..................... end of GET requests .........................

//..................... POST requests .........................

// POST new employees
app.post('/employees', function(req,res){

    var body = _.pick(req.body, 'name');    
    db.employee.create(body).then(function (employee) {
        res.json(employee.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });    
});

// POST new availability
app.post('/availabilities', function(req,res){    
    var body = _.pick(req.body, 'day', 'time', 'employeeId');
    var employeeId = parseInt(body.employeeId);
    delete body.employeeId;

    db.availability.create(body).then(function(availability){        
        db.employee.findById(employeeId).then(function(employee){

            employee.addAvailability(availability).then(function(){
                return availability.reload();
            }).then(function(){
                res.json(availability.toJSON());
            });

        });
    }, function(e){
        res.status(400).json(e);

    });     
    
    });

//POST new candidates
app.post('/candidates', function(req,res){
    var body = _.pick(req.body, 'name', 'managers');

    db.candidate.create(body).then(function(candidate){
        res.json(candidate.toJSON());
    }, function (e){
        res.status(400).json(e);
    });
});
//..................... end of POST requests .........................

//..................... DELETE requests .........................

// DELETE request for employee by id
app.delete('/employees/:id', function(req, res){
    var employeeId = parseInt(req.params.id, 10);
    db.employee.destroy({
        where: {
            id: employeeId
        }
    }).then(function(rowsDeleted){
        if(rowsDeleted === 0){
            res.status(404).json({
                "error": 'No candidates with id'
            })
        }else{
            res.status(204).send();
        }
    }, function(){
        res.status(500).send();
    })   
});

//DELETE availabilities by employee id
app.delete('/availabilities/:id', function(req,res){
    var employeeId = parseInt(req.params.id);
    db.employee.findById(employeeId).then(function (employee) {
        db.availability.destroy({
            where: {
                employeeId: employeeId
            }
        }).then(function(rowsDeleted){
            if(rowsDeleted === 0){
                res.status(404).json({
                    "error": 'No availability with this id'
                })
            }else{
                res.status(204).send();
            }
        }, function(){
            res.status(500).send();
        })   
    });
});

// DELETE request for candidates by id
app.delete('/candidates/:id', function(req,res){
    var candidateId = parseInt(req.params.id, 10);

    db.candidate.destroy({
        where: {
            id: candidateId
        }
    }).then(function(rowsDeleted){
        if(rowsDeleted === 0){
            res.status(404).json({
                "error": 'No candidates with id'
            })
        }else{
            res.status(204).send();
        }
    }, function(){
        res.status(500).send();
    })    
});
//..................... end of DELETE requests .........................


//..................... PUT requests .........................
// PUT requests for employees
app.put('/employees/:id', function(req,res){
    var employeeId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'name');
    var attributes = {};
    
    if(body.hasOwnProperty('name')){
        attributes.name = body.name;
    }
    
    db.employee.findById(employeeId).then(function(employee){
        if(employee){
            return employee.update(attributes).then(function(employee){
                res.json(employee.toJSON());
            }, function(e){
                res.status(400).json(e);
            })   
        }else{
            res.status(404).send();
        }
    }, function(){
        res.status(500).send();
    })
});

// PUT requests for availability by employee id
app.put('/availabilities/:id', function(req,res){
    var availabilityId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'day', 'time');
    var employee = _.pick(req.body, 'employeeId');;
    var employeeId = parseInt(employee.employeeId);
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
    }).then(function(availability) {
        if (availability) {
            availability.update(attributes).then(function(availability) {
                res.json(availability.toJSON());
            }, function(e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    });
});

// PUT requests for candidates
app.put('/candidates/:id', function(req,res){
    var candidateId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'name', 'managers');
    var attributes = {};
    
    if(body.hasOwnProperty('name')){
        attributes.name = body.name;
    }
    if(body.hasOwnProperty('managers')){
        attributes.managers = body.managers;
    }

    db.candidate.findById(candidateId).then(function(candidate){
        if(candidate){
            return candidate.update(attributes).then(function(candidate){
                res.json(candidate.toJSON());
            }, function(e){
                res.status(400).json(e);
            })   
        }else{
            res.status(404).send();
        }
    }, function(){
        res.status(500).send();
    })
});


//..................... end of PUT requests .........................

db.sequelize.sync({
    // force:true
    }).then(function(){
    app.listen(PORT, function(){
        console.log('Express listening on port ' + PORT + '!');
    });
}); 
