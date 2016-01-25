(function () {
    angular.module('app.people.person', [])
		.controller('personController', PersonController);

    PersonController.$inject = ['personData'];
    function PersonController(personData) {
        var vm = this;
        vm.person = personData;
    }
})();