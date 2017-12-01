
//....................GET time slots by candidates id...............
app.get('/timeslots/:id', function(req,res){
    var candidateId = parseInt(req.params.id);
    var where = {};

    db.candidate.findById(candidateId).then(function(candidate){
        if(!!candidate){            
            var string = candidate.managers;
            candidate.managers = string.replace(/, +/g, ",").split(",").map(Number);
            where.employeeId ={
                $in: [candidate.managers]
            };
            db.availability.findAll({
                where: where
            }).then(function (availabilities) {
                if(availabilities.length === 0){
                    res.status(404).send({
                        "error": "No available time slot for next week for this candidate"
                    })
                }else{
                    res.json(availabilities);
                }
            });
        }else{
            res.status(404).send({
                "error" : "No candidate available"
            });
        }
    }, function(e){
        res.status(500).send();
    });
});
//....................end of GET time slots by candidates id


