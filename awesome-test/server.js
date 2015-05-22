//load the express package and create our app
var express = require('express');
var app     = express();
var path    = require('path');

//send our index.html file to the user for the home page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//create route for the login form
app.route('/login')

  //show the form (GET http://localhost:1337/login)
  .get(function(req, res) {
    res.send('this is the login form');
  })
  
  // process the form (POST http://localhost:1337/login)
  .post(function(req, res) {
    console.log('processing');
    res.send('processing the login form!');
  })

// create routes for the admin section

// get an instance of the router
var adminRouter = express.Router();

// route middleware to validate :name
adminRouter.param('name', function(req, res, next, name) {
  //do validation on name here
  //blah blah validation
  // log something so we know its working
  console.log('doing name validations on ' + name);

  // once validation is done save the new item in the req
  req.name = name
  // go to the next thing
  next();
});

// route middleware that will happen on every request
adminRouter.use(function(req, res, next) {

  // log each request to the console.
  console.log(req.method, req.url);

  // continue doing whare we were doing and go the the route
  next();

});

// admin main page. the dashboard (https://localhost:1337/admin)
adminRouter.get('/', function(req, res) {
  res.send('I am the dashboard!');
});

// users page (http://localhost:1337/admin/users)
adminRouter.get('/users', function(req, res) {
  res.send('I show all the users!');
});

// route with parameters (http://localhost:1337/admin/users/:name)
adminRouter.get('/users/:name', function(req, res){
  res.send('hello ' + req.params.name + '!');
});

// posts page (http://localhost:1337/admin/posts)
adminRouter.get('/posts', function(req, res) {
  res.send('I show all the posts!');
});

//apply the routes to our application
app.use('/admin', adminRouter);

// start the server
app.listen(1337);
console.log('1337 is the magic port');
