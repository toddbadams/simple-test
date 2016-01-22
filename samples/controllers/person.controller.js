(function () {
    'use strict';

    var TEMPLATE_BASE_URL = '/samples/controllers/';

    angular.module('s.person.controller', [
            'ui.router',
            's.logging',
            's.data'
        ])
        .constant('s.person.controller.config', {
            route: {
                name: 'person',
                state: {
                    url: '/person',
                    templateUrl: TEMPLATE_BASE_URL + 'person.html',
                    controller: PersonController,
                    //controller: 'sPerson',
                    controllerAs: "vm",
                    resolve:
                    {
                        data: PersonResolver
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
    moduleConfig.$inject = ['$stateProvider', '$urlRouterProvider', 's.person.controller.config'];  
    function moduleConfig($stateProvider, $urlRouterProvider, config) {  
        //$urlRouterProvider.otherwise("/person");
        $stateProvider.state(config.route.name, config.route.state);
    }

    /**
     * Person controller data resolver
     */
    PersonResolver.$inject = ['dataService'];
    function PersonResolver(personDataService) {
        return personDataService.getPerson(1);
    }

    /**
     * Person controller
     */
    PersonController.$inject = ['loggingService', 'dataService', 'data'];
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