// inject ngRoute for all our routing needs
angular.module('routerRoutes', ['ngRoute'])

  // configure our routes
  .config(function($routeProvider, $locationProvider) {
    $routeProvider

    //route from the home page
    .when('/', {
      templateUrl: '/views/pages/home.html',
      controller: 'homeController',
      controllerAs: 'home'
    })

    // route from the about page
    .when('/about', {
      templateUrl: '/views/pages/about.html',
      controller: 'aboutController',
      controllerAs: 'about'
    })

    //route from the contact page
    .when('/contact', {
      templateUrl: '/views/pages/contact.html',
      controller: 'contactController',
      controllerAs: 'contact'
    });

    //set our app up to have pretty urls
    $locationProvider.html5Mode(true);
  });
