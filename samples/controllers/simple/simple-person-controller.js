(function () {
    angular.module('v.person.simple', [])
		.controller('person', PersonController);

    PersonController.$inject = ['personData'];
    function PersonController(personData) {
        var vm = this;
        vm.person = personData;
    }
})();