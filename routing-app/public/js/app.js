angular.module('routerApp', ['routerRoutes'])

  //create the controller
  //this will be the controller for the entire site
  .controller('mainController', function() {

    var vm = this;

    // creates a big message variable to display on our view
    vm.message = 'Space... The final frontier. These are the voyages of the starship Enterprise. It\'s continuing mission, to explore strange new worlds. To seek out new life and new civilizations. To boldly go where no one has gone before.';

  })

  // controller for the home page
  .controller('homeController', function() {

    var vm = this;

    vm.message = 'This is the home page. It\'s pretty boring right now';

  })

  // controller for the about page
  .controller('aboutController', function() {

    var vm = this;

    vm.message = 'We keeps it 300%!';

  })

  // controller for the contact page
  .controller('contactController', function() {

    var vm = this;

    vm.message = 'Holla at ch\'yo boi!';

  });
