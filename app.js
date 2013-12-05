
/**
 * Module dependencies.
 */
var express = require('express'),
  routes = require('./app/controllers'),
  user = require('./app/controllers/user'),
  http = require('http'),
/*  , db = require('./app/models/db')*/
  fs = require('fs'),
  path = require('path');
var app = express();
// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/home', routes.index);
app.get('/thegame', routes.thegame);
app.get('/scores', routes.scores);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/thetest');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('it works');
  var scoreSchema = mongoose.Schema({
    pseudo : String,
    tries : int,
    date : {type: Date, default: Date.now} 
  })
  var Scores = mongoose.model('Scores', scoreSchema)

});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

