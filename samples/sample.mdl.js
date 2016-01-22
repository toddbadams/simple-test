(function () {
    'use strict';

    angular.module('sample', [
        's.person.controller',
        's.data',
        's.person.directive',
        'sample.backend',
        's.logging'
    ]);
})();