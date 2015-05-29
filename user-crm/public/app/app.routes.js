angular.module('app.routes', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {

    $routeProvider

    // route to home page
    .when('/', {
      templateUrl: 'app/views/home.html'
    })

    // Login page
    .when('/login', {
      templateUrl: 'app/views/pages/login.html',
      controller: 'mainController',
      controllerAs: 'login'
    })

    // get rid of the hash in the url
    $locationProvider.html5Mode(true);

  });
