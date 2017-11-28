var express = require('express');
var bodyParser = require('body-parser');
var _ =  require('underscore');

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
    res.json(candidates);
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
    var matchedCandidate = _.findWhere(candidates, {id: candidateId});
    if(matchedCandidate){
        res.json(matchedCandidate);
    }else{
        res.status(404).send();
    }
});
//..................... end of GET requests .........................

//..................... POST requests .........................

// POST new managers
app.post('/managers', function(req,res){

    var body = _.pick(req.body, 'name', 'availability');

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
    var body = _.pick(req.body, 'name', 'availability');

    // trim name, check for string, non-zero length, 
    // check availability.day for array, empty
    // check availability.time for array, empty

    // if(_.isString(body.name) || _.isArray(body.availability.day) || _.isArray(body.availability.time || 
    // body.availability.day.length == 0 || body.availability.time.length == 0)){

    if(!_.isString(body.name)){    
        return res.status(400).send();
    }  

    // add id field
    body.id = candidateNextId++;
    // push body into array
    candidates.push(body);
    res.json(body);

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
    var candidateId = parseInt(req.params.id);
    var matchedCandidate = _.findWhere(candidates, {id: candidateId});

    if(!matchedCandidate){
        res.status(404).json({"error": "no candidate found with that id"});
    }else{
        candidates = _.without(candidates, matchedCandidate);
        res.json(matchedCandidate);
    }
});


//..................... end of DELETE requests .........................

app.listen(PORT, function(){
    console.log('Express server started');
});