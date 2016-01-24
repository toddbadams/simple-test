(function () {
    'use strict';

    myModuleConfig.$inject = ['$stateProvider'];
    function myModuleConfig($stateProvider) {
        console.log('$stateProvider = ', $stateProvider);
    };


    myModuleRun.$inject = ['$state'];
    function myModuleRun($state) {
        console.log('$state = ', $state);
    };

    angular.module('myModule', ['ui.router', 'someOtherModule'])
        .value('mySpecialObject', { id: 123 })
        .constant('myConstant', 456)
        .config(myModuleConfig)
        .run(myModuleRun);

})();