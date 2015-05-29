angular.module('mainCtrl', ['ngRoute'])

  .controller('mainController', function($rootScope, $location, Auth) {

    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
      vm.loggedIn = Auth.isLoggedIn();

      // get user info on every route change
      Auth.getUser().success(function(data) {
        vm.user = data;
      });
    });


    // function to handle login form
    vm.doLogin = function() {
      // call the Auth.login() function
      Auth.login(vm.user.username, vm.user.password)
        .success(function() {
          // if a user successfully logs in, redirect to user's page
          $location.path('/users');
        });
    };




    // function to handle logging out
    vm.doLogout = function() {

      Auth.logout();
      // if a user successfully logs in, redirect to user's page
      vm.user = {};
      $location.path('/login');
    };

  });
