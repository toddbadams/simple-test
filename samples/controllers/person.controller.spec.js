(function () {
    var
        PERSON_CNTRL_MODULE_NAME = 's.person.controller',
        PERSON_CNTRL_MODULE_CONFIG_NAME = PERSON_CNTRL_MODULE_NAME + '.config',
        PERSON_CNTRL_MODULE_RESOLVER_NAME = PERSON_CNTRL_MODULE_NAME + '.resolver',

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
        $stateProvider = function() { return sinon.stub() },
        personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
        personDataService = {
            save: sinon.stub().returnsPromise(),
            get: sinon.stub().returnsPromise()
        },
        controller,
        moduleTest,
        vm;

    _T.createModuleTest('s.person.controller')
        .injectModule('ui.router')
        .injectModule('s.logging')
        .injectModule('s.data')
        .injectProvider({ name: 'state', value: $stateProvider })
        //.injectService({ name: 'loggingService', value: loggingService })
        //.injectService({ name: 'personDataService', value: personDataService })
        .describe(function () {
            var moduleTest = this;

            //it('Should set the person route.', function() {
            //    var config = moduleTest.$injector.get(PERSON_CNTRL_MODULE_CONFIG_NAME),
            //        uut = moduleTest.$injector.get('$stateProvider');
            //    uut.state.should.have.been.calledWith(config.route.name, config.route.state);
            //});

            //this.createServiceTest('s.person.controller.resolver')
            //   // .injectService({ module: PERSON_CNTRL_MODULE_NAME, service: 'personData', value: personData })
            //    .describe(function() {
            //        var uut = this;

            //        it('Should return a promise', function() {
            //            uut.get().should.returnPromise();
            //        });
            //    });

            //moduleTest.createControllerTest('person')
            //    .controllerAs('vm')
            //    .inject({ module: 'v.common.logging', service: 'loggingService', value: loggingService })
            //    .inject({ module: 'v.person', service: 'personData', value: personData })
            //    .inject({ module: 'v.person.data', service: 'personDataService', value: personDataService })
            //    .describe(function () {
            //        controller = this;
            //        beforeEach(function () {
            //            vm = controller.scope.vm;
            //        });

            //        it('Should debug log the person model on activation', function () {
            //            loggingService.logger().debug
            //                .should.be.calledWith('activated', personData);
            //        });

            //        describe('On save attempt', function () {
            //            beforeEach(function () {
            //                vm.save();
            //            });
            //            it('Should display "saving..." message', function () {
            //                vm.isSaving.should.be.true;
            //            });
            //            it('Should save the person', function () {
            //                personDataService.save
            //                    .should.be.calledWith(personData);
            //            });
            //        });

            //        describe('On save success', function () {
            //            beforeEach(function () {
            //                personDataService.save.resolves();
            //                vm.save();
            //            });
            //            it('Should hide the "saving..." message', function () {
            //                vm.isSaving.should.be.false;
            //            });
            //        });
            //    });
        });
})();