// Start angular module and inject userSerivice
angular.module('userCtrl', ['userService'])

  // userController for the main page
  // inject the user Factory
  .controller('userController', function(User) {
    vm = this;

    vm.processing = true;

    // grab all the users a page load
    User.getAllUsers()
      .success(function(data) {
        vm.processing = false;
        //bind all the users that come back to vm.users
        vm.users = data;
      });

    // delete a user
    vm.deleteUser = function(id) {
      vm.processing = true;
      User.deleteUser(id)
        .success(function() {

          User.getAllUsers()
            .success(function(data) {
              vm.processing = false;
              vm.users = data;
            });
        });
    };
  })

  .controller('userCreateController', function(User) {
      vm = this;

      vm.type = 'create';

      vm.saveUser = function () {

        vm.processing = true;
        // check that the new passwords agree
        if (vm.userData.password === vm.userData.confirmPassword) {
          User.postUser(vm.userData)
            .success(function(data) {
              vm.processing = false;
              vm.userData = {};
              vm.message = data.message;

            })
            .fail(function(data) {
              vm.processing = false;
              vm.message = data.message;
            });
        } else {
          vm.message = 'passwords did not match';
        }
      };
  })

  // controller for editing users
  .controller('userEditController', function($routeParams, User) {
    vm = this;

    vm.type='edit';

    User.getUser($routeParams.user_id)
      .success(function(data) {
        vm.userData = data;
      });

    vm.saveUser = function() {
      vm.processing = true;

      User.putUser($routeParams.user_id, vm.userData)
        .success(function(data) {
          vm.processing = false;
          vm.userData = {};
          vm.message = data.message;
        });
    };
  });
