(function() {
    'use strict';

    var TEMPLATE_BASE_URL = '/samples/directives/';

    angular.module('s.person.directive', [])
        .directive('person', PersonDirective);

    PersonDirective.$inject = [];
    function PersonDirective() {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: TEMPLATE_BASE_URL + 'person.html',
            link: link
        };

        function link(scope, element, attr) {
            
        }
    }
})();