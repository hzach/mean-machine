angular.module('authService', [])

//============================================
// facotry for handling tokens
// inject $window to store token client-side
//============================================
  .facotry('Auth', function($http, $q, AuthToken) {

    // create auth factory object
    var authFactory = {};

    // handle login

    // handle logout

    // check if a user is logged in

    // get the user infor

    //return the factory object
    return authFactory;


  });
