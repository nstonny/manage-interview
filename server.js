var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
// --------------------------------------------------------------------
var managers = [{
    id: 1,
    name: 'Angela Walker',
    availability:{
        date: ['Monday', 'Wednesday'],
        time: ['10.00-12.00', '13.00-15.30']
    }
},
{
    id: 2,
    name: 'Lia Shelton',
    availability:{
        day: ['Tuesday', 'Wednesday', 'Friday'],
        time: ['10.00-12.00', '13.00-15.30', '14.00-16.00']
    }
}];
var candidates = [{
    id: 1,
    name: 'Anna Bass',
    availability:{
        date: ['Monday', 'Friday'],
        time: ['10.00-12.00', '11.00-12.00']
    }
},
{
    id: 2,
    name: 'Darrell Gill',
    availability:{
        day: ['Wednesday', 'Thursday'],
        time: ['13.30-14.30', '13.00-15.30']
    }
}];
// .......................................................................

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
    var matchedManager;

    managers.forEach(function(manager){
        if(managerId === manager.id){
            matchedManager = manager;
        }
    });
    if(matchedManager){
        res.json(matchedManager);
    }else{
        res.status(404).send();
    }        
});

//GET candidate by id
app.get('/candidates/:id', function(req,res){
    var candidateId = parseInt(req.params.id);
    var matchedCandidate;

    candidates.forEach(function(candidate){
        if(candidateId === candidate.id){
            matchedCandidate = candidate;
        }
    });
    if(matchedCandidate){
        res.json(matchedCandidate);
    }else{
        res.status(404).send();
    }
});


app.listen(PORT, function(){
    console.log('Express server started');
});