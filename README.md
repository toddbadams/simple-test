# simple-test
Simplied angular unit test api


## Controllers

### The Code
```javascript
(function () {

    angular.module('v.person', ['v.common.logging'])
		.controller('person', PersonController);

    PersonResolver.$inject = ['personDataService'];
    function PersonResolver(personDataService) {
        return personDataService.get();
    }

    /**
     * The person controller
     */
    PersonController.$inject = ['loggingService', 'personDataService', 'personData'];
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
```


### The Tests
```javascript
(function() {
    var
        loggingService = (function() {
            var debugStub = sinon.stub();

            return {
                logger: function() {
                    return {
                        debug: debugStub
                    };
                }
            };
        })(),
        personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
        personDataService = {
            save: sinon.stub().returnsPromise()
        },
        controller,
        vm;

    _T.addModule('v.person')
        .inject(['v.common.logging'])
        .describe(function() {
            this.addController('person')
                .controllerAs('vm')
                .inject({
                    'loggingService': loggingService,
                    'personData': personData,
                    'personDataService': personDataService
                })
                .describe(function() {
                    controller = this;
                    beforeEach(function() { vm = controller.scope.vm; });

                    it('Should debug log the person model on activation', function() {
                        loggingService.logger().debug
                            .should.be.calledWith('activated', personData);
                    });

                    describe('On save attempt', function() {
                        beforeEach(function() {
                            vm.save();
                        });
                        it('Should display "saving.." message', function() {
                            vm.isSaving.should.be.true;
                        });
                        it('Should save the person', function() {
                            personDataService.save
                                .should.be.calledWith(personData);
                        });
                    });

                    describe('On save success', function() {
                        beforeEach(function() {
                            personDataService.save.resolves();
                            vm.save();
                        });
                        it('Should hide the "saving..." message', function() {
                            vm.isSaving.should.be.false;
                        });
                    });
                });
        });
})();
```