var
    personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
    angularModule,
    $controller,
    $rootScope,
    angularController,
    $scope;

describe('app.people.person Module', function () {
    beforeEach(function () {
        angular.mock.module('app.people.person');
        angularModule = angular.module(self.name);
        inject(function ($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
        });
    });

    it('Should exist as an angular module', function () {
        angularModule.should.exist;
    });

    describe('personController Controller', function () {
        beforeEach(function () {
            $scope = $rootScope.$new();
            angularController = $controller('personController', { 'personData': personData });
            $scope.vm = angularController;
        });
        it('Should have a scope', function () {
            $scope.should.exist;
        });
        it('Should contain the person data', function () {
            $scope.vm.person
                .should.be.equal(personData);
        });
    });
});