# simple-test
**Simple Test provides simplied angular unit testing, and is a work in progress.  Coming soon...**



## Installation

via [Bower](http://bower.io/ "http://bower.io/")


```

	tbd

```

This provides `_T` as a global object, and loads the following requirements:

- [Angular](https://github.com/angular/bower-angular.js "https://github.com/angular/bower-angular.js")
- [Angular Mocks](https://github.com/angular/bower-angular-mocks "https://github.com/angular/bower-angular-mocks") - provides support to inject and mock angular services
- [mocha](https://github.com/mochajs/mocha "https://github.com/mochajs/mocha") - a Javascript test framework
- [chai](https://github.com/chaijs/chai "https://github.com/chaijs/chai") - a BDD/TDD assertion framework 
- [sinon](https://github.com/sinonjs/sinon "https://github.com/sinonjs/sinon") - Javascript test spies, stubs and mocks
- [sinon-chai](https://github.com/domenic/sinon-chai "https://github.com/domenic/sinon-chai") - Extends chai with assertions for the sinon

## A Simple Example
The following is a very simple controller that takes a single dependency and assigns it to the view model (vm).

```javascript

        angular.module('v.person.simple', [])
		    .controller('person', PersonController);

        PersonController.$inject = ['personData'];
        function PersonController(personData) {
            var vm = this;
            vm.person = personData;
        }

```

This is then tested with the following .spec.js file.


```javascript

    var
        personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
        controller;
    
    _T.createModule('app.people.person')
            .describe(function() {
                this.addController('personController')
                    .controllerAs('vm')
                    .inject({
                        'personData': personData
                    })
                    .describe(function () {
                        controller = this;
                        it('Should contain the person data', function() {
                            controller.scope.vm.person
                                .should.be.equal(personData);
                        });
                    });
            });

```

##Why?

###Saves Time

**Simple Test** reduces the amount of code required to unit test (and time)!  The simple example without **Simple Test** is shown below.  The unit test code has reduced by over 40%, and this is for a very simple controller.  In a typical application, this substantially reduces the amount of time spent writing unit tests.

```javascript

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

```

### Enforces Code Standards
The **Simple Test** framework has been written to follow [John Papa's Angular Style Guide](https://github.com/johnpapa/angular-styleguide "https://github.com/johnpapa/angular-styleguide"). This is an opinionated style guide for syntax, conventions, and structuring Angular applications.  **Simple Test** follows these conventions in setting out it's testing methods. For example, there is a method `.backend('/api/person', personData)` that allows mocking a backend response.  While technically a developer can place a backend call withing a directive or controller, the style guide calls for the logic to reside in an angular factory [Style [Y060](https://github.com/johnpapa/angular-styleguide#style-y060)]. Therefore the `.backend('/api/person', personData)` is only avialble to test on the **Simple Test** `Factory` object, as shown in the following code example.

```javascript

	var
	    personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
	    personId = 1,
	    personPromise = sinon.stub().returnsPromise().resolves(personData),
	    method;
	
	_T.createModule('app.people.person')
	        .describe(function () {
	            this.createFactory('personDataService')
	                .describe(function () {
	                    this.createMethod('get', [personId])
	                        .backend('/api/person', personPromise)
	                        .it('get the person data', function () {
	                            this.result.should.be.equal(personData);
	                        });
	                });
	        });

```


## API

For more information view the [documentation](https://github.com/toddbadams/simple-test/wiki "https://github.com/toddbadams/simple-test/wiki").
