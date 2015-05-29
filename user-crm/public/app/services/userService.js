angular.module('userService', [])

  .factory('User', function($http) {

    // create a new object
    var userFactory = {};

    // get a single user
    userFactory.getUser = function(id) {
      return $http.get('api/users/' + id);
    };

    // get all users
    userFactory.getAllUsers = function() {
      return $http.get('api/users/');
    };

    // create a new user
    userFactory.postUser = function(userData) {
      return $http.post('api/users/', userData);
    };

    // update existing user
    userFactory.putUser = function(userData) {
      return $http.put('api/users/', userData);
    };

    // delete existing user
    userFactory.deleteUser = function(id) {
      return $http.delete('api/users/' + id);
    };

  });
