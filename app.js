
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
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
var buffer = new Array();
var mongoose = require( 'mongoose' );
var count = 0;
var nbClient = 0;
app.get('/', routes.index);
app.get('/home', routes.index);



var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
    nbClient++;
    socket.emit("oldStuff",buffer);
    socket.emit("id",nbClient);

    socket.on('infoPoint', function (data)
    {
      
      socket.broadcast.emit('newPoint',data);
      
      buffer[count]=data;
      
      count += 1;
    });
    
    socket.on('reset', function (data)
    {
      buffer = new Array();
      count = 0;
      socket.broadcast.emit('reset');
    });

});