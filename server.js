var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//replace with public folder
app.get('/', function(req, res){
    res.send('Welcome to manage interview app');
}); 

app.use('/employees', require('./routes/employee.js'));
app.use('/candidates', require('./routes/candidate.js'));
app.use('/availabilities', require('./routes/availabilities.js'));
app.use('/timeslots', require('./routes/timeslots.js'));

db.sequelize.sync({
    //force:true
    }).then(function(){
    app.listen(PORT, function(){
        console.log('Express listening on port ' + PORT + '!');
    });
}); 
