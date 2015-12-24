(function () {
    angular.module('app.people', [])
		.controller('person', PersonController);

    PersonController.$inject = ['personData'];
    function PersonController(personData) {
        var vm = this;
        vm.person = personData;
    }
})();