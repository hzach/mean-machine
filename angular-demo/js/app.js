// name our angular application
angular.module('firstApp', [])

  .controller('mainController', function() {

    // bind this to vm (view-model)
    var vm = this;

    // define the variable and object on this
    // this lates them be available to our views
    vm.message = 'Hey there! Come and see how good I look!';

    // define a list of items
    vm.computers = [
      { name: 'Macbook Pro', color: 'Silver', nerdness: 7},
      { name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6},
      { name: 'Chromebook', color: 'Black', nerdness: 5}
    ];

    vm.computerData = {};

    vm.addComputer = function() {
      vm.computers.push({
        name: vm.computerData.name,
        color: vm.computerData.color,
        nerdness: vm.computerData.nerdness
      });

      vm.computerData = {};
    };

  });
