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
  res.render('index');
};
