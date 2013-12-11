 var mongoose = require( 'mongoose' );

 var scoreSchema = new mongoose.Schema({
    pseudo : {type: String, default: 'Napoleon'},
    tries : Number,
    date : {type: Date, default: Date.now} 
  })

  mongoose.model('scoreSchema', scoreSchema)

  var uristring =
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/thetest#1';

  mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});