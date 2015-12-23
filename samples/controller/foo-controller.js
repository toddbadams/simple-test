(function () {

    angular.module('v.person', ['v.common.logging'])
		.controller('person', PersonController);

    PersonResolver.$inject = ['personDataService'];
    function PersonResolver(personDataService) {
        return personDataService.get();
    }

    /**
     * The person controller
     */
    PersonController.$inject = ['loggingService', 'personDataService', 'personData'];
    function PersonController(loggingService, personDataService, personData) {
        var vm = this,
            logger = loggingService.logger('person');
        vm.save = save;
        vm.isSaving = false;
        vm.person = personData;
        logger.debug('activated', vm.person);

        function save() {
            vm.isSaving = true;
            personDataService.save(vm.person)
                .then(postSave);
        }

        function postSave() {
            vm.isSaving = false;
        }
    }
})();