var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

// app.get('/', function(req, res){
//     res.send('Hello express');
// });

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function(){
    console.log('Express server started');
});