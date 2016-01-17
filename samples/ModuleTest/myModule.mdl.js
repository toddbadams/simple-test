(function () {

    angular.module('myModule', [])
        .value('mySpecialObject', { id: 123 })
        .constant('myConstant', 456);

})();