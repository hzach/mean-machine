var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var port = process.env.PORT || 8080;

//APP CONFIGURATION
// use body parser so we can grab information from Post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connect to the database
mongoose.connect('mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o');

//configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Resquested-With, context-type, Authorization');
  next();
});

//log all requests to the console
app.use(morgan('dev'));

//basic route for homepage
app.get('/', function(req, res) {
  res.send('welcome to the home page!');
});

//get an instance of the express router
var apiRouter = express.Router();

//middleware to use for all requests
apiRouter.use(function(req, res, next) {
  console.log('Somebody just came to our app!');
  next(); //make sure we move on to the next route
});

//test route to make sure everything is working
//accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!'});

});

//more routes for our API will happen here

//REGISTER OUR ROUTES --------------------------------
//all of our routes will be prefixed with /api
app.use('/api', apiRouter);

//on routes that end with /user
//----------------------------------------------------
apiRouter.route('/users')

  //create a new user
  .post(function(req, res) {

    //create a new instance of the user model
    var user = new User();

    //set the user's information from the requests
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    //save the user and check for errors
    user.save(function(err) {
      if (err) {
        //duplicate entry
        if (err.code == 11000)
          return res.json({ success: false, message: 'a user with that username already exists'});
        else
          return res.send(err);
      }

      res.json({ success: true, message: 'user created!'});

    });

  })

  //gets all users in the db
  .get( function(req, res) {

    User.find(function(err, users) {
        if (err) res.send(err);
        // return the users
        res.json(users);
    });
  });

  // on routes that end with /users/:user_id
  // ---------------------------------------
  apiRouter.route('/users/:user_id')

    //get the account details of a specific user
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        res.json(user);
      });
    })

    //update a user's information
    .put(function(req, res) {

      User.findById(req.params.user_id, function(err, user) {

          if (err) res.send(err);

          // update the user only if there is a change
          if (req.body.name) user.name = req.body.name;
          if (req.body.username) user.username = req.body.username;
          if (req.body.password) user.password = req.body.password;

          user.save(function(err) {
            if (err) res.send(err);

            res.json({message: 'User was updated!'});

          });
      });
    })
    //remove a user by id
    .delete(function(req, res) {
      User.remove(
        {
        _id : req.params.user_id
        },
       function(err, user) {
        if (err) res.send(err);
        
        res.json({message: 'User was deleted!'});
      });
    });



//START THE SERVER
//==================================
app.listen(port);
console.log('Magic happens on port ' + port);
