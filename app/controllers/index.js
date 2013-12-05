/*
 * GET home page.
 */
//var db = require('../models/db');
var mongoose = require( 'mongoose' );
//var motiModel  =  mongoose.model( 'moti' );
var url = require("url");
var fs = require('fs');
//var month, day, hour, min, date,moti;



exports.index = function(req, res){
  
  res.render('index', { title: 'Home' });
};

exports.scores = function(req, res){
  res.render('scores', { title: 'Scores' });
};

exports.thegame = function(req, res){

  res.render('thegame', { title: 'theGame' });
};
