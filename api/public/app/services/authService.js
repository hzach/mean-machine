angular.module('authService', [])

//============================================
// facotry for handling tokens
// inject $window to store token client-side
//============================================
  .factory('Auth', function($http, $q, AuthToken) {

    // create auth factory object
    var authFactory = {};

    // handle login
    authFactory.login = function(username, password) {
      $http.post('api/authenticate', {
        username: username,
        password: password
      })
      .success(function(data) {
        AuthToken.setToken(data.token);
        return data;
      });
    };

    // handle logout
    authFactory.logout = function() {
      AuthToken.setToken();
    };

    // check if a user is logged in
    authFactory.isLoggedIn = function() {
      if (AuthToken.getToken())
        return true;
      else
        return false;
    };

    // get the user info
    authFactory.getUser = function() {
      if (AuthToken.getToken())
        return $http.get('api/me', { cache: true });
      else
        return $q.reject({ message: 'User has no token' });
    };

    //return the factory object
    return authFactory;

  })

  //===========================================
  // factory for handling tokens
  // inject $window to store token client-side
  //===========================================
  .factory('AuthToken', function($window) {

    var AuthTokenFactory = {};

    // get the token
    AuthTokenFactory.getToken = function() {
      return $window.localStorage.getItem('token');
    };

    // set the token or clear the token
    AuthTokenFactory.setToken = function(token) {
      if (token)
        $window.localStorage.setItem('token', token);
      else
        $window.localStorage.removeItem('token');
    };

    return AuthTokenFactory;
  })

  //=============================================================
  // Application configuration to inject token into http requests
  //=============================================================
  .factory('AuthInterceptor', function($q, $location, AuthToken) {

    var interceptorFactory = {};

    // attach the token into every requests
    // this will happen on all http requests
    interceptorFactory.request = function(config) {

      var token = AuthToken.getToken();

      // if the token exists add it to the header as an x-access-token
      if (token)
        config.headers['x-access-token'] = token;

      return config;
    };

    // redirect if token doesn't authenticate
    // happens on response errors
    interceptorFactory.redirect = function(response) {

      // 403 forbidden response
      if (response.status == 403) {
        AuthToken.setToken();
        $location.path('/login');
      }

      // return the errors from the server as a promise
      return $q.reject(response);
    };

    return interceptorFactory;
  });
