
var url = require("url");
var fs = require('fs');

var db = require('../models/db');
var mongoose = require( 'mongoose' );
var Scores = mongoose.model('scoreSchema')


exports.lvl = function(req, res){
  fs.readFile('public/json/lvl.json', function (err, data) {
  if (err) throw err;
  res.render('lvl', { title: 'lvl',content:data });
});
  
};


exports.database = function(req, res){
Scores.find().sort({tries: 1}).exec(function ( err, result ){  
		   
		res.render('database', { title: 'database',
		 data : result
		 
        
		});
	});
};