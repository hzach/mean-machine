var bodyParser = require('body-parser');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config.js');
var morgan = require('morgan');

var superSecret = config.secret;

module.exports = function(app, express) {

  //get an instance of the express router
  var apiRouter = express.Router();

  // route for authenication
  apiRouter.post('/authenticate', function(req, res) {

      User.findOne({
        username: req.body.username
      }).select('name username password').exec(function(err, user) {
          if (err) throw err;

          if (!user) {
            res.json({
              success: false,
              message: 'Authenication failed. User not found'
            });
          } else if (user) {

            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
              res.json({
                success: false,
                message: 'Authenication failed. Password did not match'
              });
            } else if (validPassword) {
              var token = jwt.sign({
                name: user.name,
                username: user.username,
              }, superSecret, {
                expiresInMinutes: 1440
              });

              res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
              });
            }
          }
      });
  });

  //middleware to use for all requests
  //---------------------------------------------------

  //route middleware to verify a token
  apiRouter.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    console.log('Somebody just came to our app!');

    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token'
          });
        } else {
          // if everything isgood, save to request for use in other routes
          req.decoded = decoded;

          next();
        }
      });
    } else {

      //if there is no token
      // return an HTTP response of 403 (access forbidden) and an error message
      return res.status(403).send({
        success: false,
        message: 'Token not found'
      });
    }
  });

  //more routes for our API will happen here

  //REGISTER OUR ROUTES --------------------------------
  //all of our routes will be prefixed with /api
  app.use('/api', apiRouter);

  //test route to make sure everything is working
  //accessed at GET http://localhost:8080/api
  apiRouter.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!'});
  });

  // api endpoint to get user information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

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

      return apiRouter;
  };
