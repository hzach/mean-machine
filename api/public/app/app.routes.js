angular.module('app.routes', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {

    $routeProvider

    // route to home page
    .when('/', {
      templateUrl: '../views/home.html'
    });

    // get rid of the hash in the url
    $locationProvider.html5Mode(true);
    
  });
