(function () {
    var
        loggingService = (function () {
            var debugStub = sinon.stub();

            return {
                logger: function () {
                    return {
                        debug: debugStub
                    };
                }
            };
        })(),
        $stateProvider = function () { return sinon.stub() },
        personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
        personDataService = {
            updatePerson: sinon.stub().returnsPromise(),
            getPerson: sinon.stub().returnsPromise().resolves(personData)
        },
    controller,
    vm;

    _T.createModuleTest('s.person.controller')
        .injectModule('s.logging')
        .injectModule('s.data')
        .injectService({ name: '$state', value: $stateProvider })
        .describe(function () {
            var moduleTest = this;

            this.createServiceTest('s.person.controller.resolver')
                .injectService({ name: 'dataService', value: personDataService })
                .describe(function () {
                    var uut = this;

                    it('Should return a promise that resolves to the person data', function () {
                        uut.angularService.then(function (data) {
                            data.should.be.equal(personData);
                        });
                    });
                });

            moduleTest.createControllerTest('sPerson')
                .controllerAs('vm')
                .injectService({ name: 'loggingService', value: loggingService })
                .injectService({ name: 'data', value: personData })
                .injectService({ name: 'personDataService', value: personDataService })
                .describe(function () {
                    controller = this;
                    beforeEach(function () {
                        vm = controller.scope.vm;
                    });

                    it('Should debug log the person model on activation', function () {
                        loggingService.logger().debug
                            .should.be.calledWith('activated', personData);
                    });

                    describe('On save attempt', function () {
                        beforeEach(function () {
                            vm.save();
                        });
                        it('Should display "saving..." message', function () {
                            vm.isSaving.should.be.true;
                        });
                        it('Should save the person', function () {
                            personDataService.updatePerson
                                .should.be.calledWith(personData);
                        });
                    });

                    describe('On save success', function () {
                        beforeEach(function () {
                            personDataService.updatePerson.resolves();
                            vm.save();
                        });
                        it('Should hide the "saving..." message', function () {
                            vm.isSaving.should.be.false;
                        });
                    });
                });
        });
})();