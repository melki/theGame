 var mongoose = require( 'mongoose' );

 var scoreSchema = new mongoose.Schema({
    pseudo : {type: String, default: 'Napoleon'},
    tries : Number,
    date : {type: Date, default: Date.now} 
  })

  mongoose.model('scoreSchema', scoreSchema)

  mongoose.connect('mongodb://localhost/thetest#1');