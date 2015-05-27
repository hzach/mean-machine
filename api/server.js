var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config.js');
var path = require('path');

//APP CONFIGURATION
// use body parser so we can grab information from Post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connect to the database
mongoose.connect(config.database);

//configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Resquested-With, context-type, Authorization');
  next();
});

//log all requests to the console
app.use(morgan('dev'));

// set static files location
// used for requests that out frontend will make
app.use(express.static(__dirname + '/public'));

//API ROUTES -----------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// Main CATCHALL ROUTE -----------------
// SEND USERS TO FRONTEND --------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//START THE SERVER
//==================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);