(function () {
    'use strict';

    angular.module('s.data', ['ng'])
		.factory('dataService', dataService);

    /**
     * The data service
     */
    dataService.$inject = ['$http'];
    function dataService($http) {

        function getPerson(id) {
            return $http({
                    method: 'GET',
                    url: 'http://api.samples.com/person/' + id
                }).
                then(function(result) {
                    return new Person(result.data);
                });
        }

        function updatePerson(id, person) {
            return $http({
                    method: 'PUT',
                    url: 'http://api.samples.com/person/' + id,
                    data: person.toPutModel()
                }).
                then(function(result) {
                    return new Person(result.data);
                });
        }

        function createPerson(data) {
            return new Person(data);
        }

        return {
            getPerson: getPerson,
            updatePerson: updatePerson,
            createPerson: createPerson
        }
    }

    var Person = (function () {
        var p = function (data) {
            this.first = data.first;
            this.last = data.last;
            this.full = this.first + ' ' + this.last;
            this.dob = new Date(data.dob);
            return this;
        }
        p.prototype.age = function (date) {
            var ageDifMs = date - this.dob;
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        p.prototype.toPutModel = function() {
            return {
                first: this.first,
                last: this.last,
                dob: this.dob.toString()
            }
        }
        return p;
    })();
})();