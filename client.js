var express = require('express');
var app = express();

//Set port for heroku and local as well 
app.set('port', (process.env.PORT || 3000));

//Store all HTML, css, js files in client folder.
app.use(express.static(__dirname + '/client'));


app.get('/',function(req,res){
  res.sendFile('/index.html');
});

app.listen(app.get('port'), function() {
console.log('Videocall app is running');
}); 