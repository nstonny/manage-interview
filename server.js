var PORT = 3000;
var express = require('express');
var app = express();

//app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.send('Hello express');
});

app.listen(PORT, function(){
    console.log('Express server started');
});