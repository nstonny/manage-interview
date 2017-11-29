var express = require('express');
var bodyParser = require('body-parser');
var _ =  require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var managers = [];
var candidates = [];
var managerNextId = 1;
var candidateNextId = 1;

app.use(bodyParser.json());

//..................... GET requests .........................
app.get('/', function(req, res){
    res.send('Welcome to manage interview app');
}); 
//GET all managers
app.get('/managers', function(req, res){
    res.json(managers);
});

//GET all candidates
app.get('/candidates', function(req, res){
    db.candidate.findAll().then(function(candidates){
        res.json(candidates);
    }, function(e){
        res.status(500).send();
    })    
});

//GET manager by id
app.get('/managers/:id', function(req, res){
    var managerId = parseInt(req.params.id, 10);
    var matchedManager = _.findWhere(managers,{id: managerId});     
    if(matchedManager){
        res.json(matchedManager);
    }else{
        res.status(404).send();
    }        
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

// POST new managers
app.post('/managers', function(req,res){

    var body = _.pick(req.body, 'name', 'availability');

    // db.manager.create(body).then(function(manager){
    //     res.json(manager.toJSON());
    // }, function(e){
    //     res.status(400).json(e);
    // })

    // trim name, check for string, non-zero length, 
    // check availability.day for array, empty
    // check availability.time for array, empty

    // if(_.isString(body.name) || _.isArray(body.availability.day) || _.isArray(body.availability.time || 
    // body.availability.day.length == 0 || body.availability.time.length == 0)){
    if(!_.isString(body.name)){    
        return res.status(400).send();
    }    
    // add id field
    body.id = managerNextId++;    
    // push body into array
    managers.push(body);    
    res.json(body);
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

// DELETE request for managers by id
app.delete('/managers/:id', function(req, res){
    var managerId = parseInt(req.params.id, 10);
    var matchedManager = _.findWhere(managers, {id: managerId});

    if(!matchedManager){
        res.status(404).json({"error": "no manager found with that id"});
    }else{
        managers = _.without(managers, matchedManager);
        res.json(matchedManager);
    }
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
// PUT requests for managers
app.put('/managers/:id', function(req,res){
    var managerId = parseInt(req.params.id, 10);
    var matchedManager = _.findWhere(managers, {id: managerId});
    var body = _.pick(req.body, 'name', 'availability');
    var validAttributes = {};
    
    if(!matchedManager){
        return res.status(404).send();
    }
    if(body.hasOwnProperty('name') && _.isString(body.name)){
        validAttributes.name = body.name;
    }else if (body.hasOwnProperty('name')){
        return res.status(400).send();
    }

    // do validation for availability

    // update with valid attributes
    _.extend(matchedManager, validAttributes);
    res.json(matchedManager);
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

db.sequelize.sync({force:true}).then(function(){
    app.listen(PORT, function(){
        console.log('Express listening on port ' + PORT + '!');
    });
});
