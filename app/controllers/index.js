/*
 * GET home page.
 */
var db = require('../models/db');
var mongoose = require( 'mongoose' );
var Scores = mongoose.model('scoreSchema')
var url = require("url");
var fs = require('fs');
var month, year, day, hour, min, date;



exports.index = function(req, res){
  
  res.render('index', { title: 'Home' });
};

exports.scores = function(req, res){
	 Scores.find().sort({tries: 1}).exec(function ( err, result ){  
		   
		res.render('scores', { title: 'Scores',
		 data : result,
		 f: { formatDate:function(a){
        	    var date = new Date(a);
		        var   month = date.getMonth()+1;
		        var   year = date.getFullYear();
		        var   day = date.getDate();
		        var   min = date.getMinutes();
		        var   hour = date.getHours();
		        return(day+'/'+month+'/'+year+' at '+hour+'h'+min);
        	}}
		});
	});
};

exports.thecubegame = function(req, res){

  res.render('thecubegame', { title: 'theCubeGame' });
};
