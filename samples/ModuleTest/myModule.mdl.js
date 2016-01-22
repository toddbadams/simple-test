
myModuleRun.$inject = ['$state'];
function myModuleRun($stateProvider) {
    console.log('$stateProvider = ',$stateProvider);
};

angular.module('myModule', ['someOtherModule'])
    .value('mySpecialObject', { id: 123 })
    .constant('myConstant', 456)
    .run(myModuleRun);
