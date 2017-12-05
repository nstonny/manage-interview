var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');
var middleware = require('./middleware.js');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/users', require('./routes/user.js'));
app.use('/employees', require('./routes/employee.js'));
app.use('/candidates', require('./routes/candidate.js'));
app.use('/availabilities', require('./routes/availability.js'));
app.use('/timeslots', require('./routes/timeslots.js'));

/**
 * syncs database, then starts the express app at localhost PORT
 */
db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log('Express listening on port ' + PORT + '!');
    });
}); 
