
/**
 * Module dependencies.
 */
var express = require('express'),
  routes = require('./app/controllers'),
  admin = require('./app/controllers/admin'),
  db = require('./app/models/db'),
  http = require('http'),
  fs = require('fs'),
  path = require('path');

var app = express();
// all environments
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico'))); 

var auth = express.basicAuth(function(user, pass, callback) {
 var result = (user === 'melki' && pass === 'test');
 callback(null , result);
});

app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/home', routes.index);
app.get('/psycho', routes.psycho);
app.get('/thecubegame', routes.thecubegame);
app.get('/scores', routes.scores);
app.get('/admin/lvl',auth, admin.lvl);
app.get('/admin/database',auth, admin.database);




var mongoose = require('mongoose');
var Scores = mongoose.model('scoreSchema')



var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  
});

var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {


  socket.on('modificationLvl', function (data)
    {
      fs.writeFile(__dirname + "/public/json/lvl.json", data, function(err) {
      if (err) {
        throw err;
      }
    });
    });

  socket.on('newscore', function (data)
    {
      if( data[1] == ''){ data[1]="Napoleon";};
      var newscore = new Scores({ pseudo: data[1], tries: data[0] })
      newscore.save(function (err) {
        if (err) { throw err; }
        console.log('Score succesfully add ! '+ newscore);
        });
    });

});