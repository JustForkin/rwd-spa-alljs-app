/**
 * Module dependencies.
 */
var express = require('express');

//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');


// Setup Database config for mongoose
var configDB = require('./config/userDb.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

var app = express();
var allowCrossDomain = function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
}

require('./config/passport')(passport); // pass passport for configuration

// all environments
app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	/* 'default', 'short', 'tiny', 'dev' */
	app.use(express.logger('dev'));		// log request to console
	app.use(express.bodyParser());		// provides info on html forms
	app.use(express.cookieParser());	// read cookies (needed for auth)
	app.use(express.methodOverride());
	app.use(allowCrossDomain);
//	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	
	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
});


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes/routes.js')(app,passport); // load our routes and pass in our app and fully configured passport

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
