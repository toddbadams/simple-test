﻿(function () {
    var TEMPLATE_BASE_URL = '/samples/controllers/templates';

    angular.module('s.person.controller', [
            'ui.router',
            's.logging',
            's.data'
    ])
        .constant('s.person.controller.config', {
            route: {
                name: 's.person',
                state: {
                    url: '/person',
                    templateUrl: TEMPLATE_BASE_URL + 'person.html',
                    controller: 'sPerson',
                    controllerAs: "vm",
                    resolve:
                    {
                        data: 's.person.controller.resolver'
                    }
                }
            }
        })
        .config(moduleConfig)
        .factory('s.person.controller.resolver', PersonResolver)
        .controller('sPerson', PersonController);

    /**
     * Person controller route configuration
     */
    moduleConfig.$inject = [ 's.person.controller.config'];  //'$stateProvider',
    function moduleConfig(config) { // $stateProvider,
       // $stateProvider.state(config.route.name, config.route.state);
       // $stateProvider.state(config.route.name, config.route.state);
    }

    /**
     * Person controller data resolver
     */
    PersonResolver.$inject = ['personDataService'];
    function PersonResolver(personDataService) {
        return personDataService.get();
    }

    /**
     * Person controller
     */
    PersonController.$inject = ['loggingService', 'personDataService', 'data'];
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