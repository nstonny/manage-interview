//............Availability......................
//GET all availabilities
app.get('/availabilities', function(req, res){    
    db.availability.findAll().then(function (availabilities) {
        res.json(availabilities);
    }, function (e) {
        res.status(500).send();
    });
});
//GET availabilities by employee id
app.get('/availabilities/:id', function(req,res){
    var employeeId = parseInt(req.params.id);
    db.employee.findById(employeeId).then(function (employee) {
        if(employee){
            employee.getAvailabilities().then(function (availabilities) {                
                res.json(availabilities);
            });
        }else{
            res.status(404).send({
                "error": "no employee found with that id"
            })
        }
    }, function(e){
        res.status(500).send();
    });
});
// POST new availability using employeeId for association
app.post('/availabilities', function(req,res){    
    var body = _.pick(req.body, 'day', 'time', 'employeeId');
    var employeeId = parseInt(body.employeeId);
    delete body.employeeId;

    db.availability.create(body).then(function(availability){        
        db.employee.findById(employeeId).then(function(employee){
            if(employee){
                employee.addAvailability(availability).then(function(){
                    return availability.reload();
                }).then(function(){
                    res.json(availability.toJSON());
                });
        }else{
            res.status(404).json({
                "error": "no employee with this id"
            });
          }
        });
    }, function(e){
        res.status(400).json(e);
    }); 
});
//DELETE availabilities based on availability id
app.delete('/availabilities/:id', function(req,res){
    var availabilityId = parseInt(req.params.id);
    db.availability.destroy({
        where: {
            id: availabilityId
        }
    }).then(function(rowsDeleted){
        if(rowsDeleted === 0){
            res.status(404).json({
                "error": "No availability with this id"
            })
        }else{
            res.status(204).send();
        }
    }, function(){
        res.status(500).send();
    });    
});
// PUT requests for availability by availability id
app.put('/availabilities/:id', function(req,res){
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
