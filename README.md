# simple-test
**Simple Test provides simplied angular unit testing is a work in progress.  Coming soon...**



## Installation

via [http://bower.io/](http://bower.io/ "Bower")


```

	tbd

```

This provides `_T` as a global object, and loads the following requirements:

- [https://github.com/angular/bower-angular.js](https://github.com/angular/bower-angular.js "Angular")
- [https://github.com/angular/bower-angular-mocks](https://github.com/angular/bower-angular-mocks "Angular Mocks") - provides support to inject and mock Angular services
- [https://github.com/mochajs/mocha](https://github.com/mochajs/mocha "mocha") - a Javascript test framework
- [https://github.com/chaijs/chai](https://github.com/chaijs/chai "chai") - a BDD/TDD assertion framework 
- [https://github.com/sinonjs/sinon](https://github.com/sinonjs/sinon "sinon") - Javascript test spies, stubs and mocks
- [https://github.com/domenic/sinon-chai](https://github.com/domenic/sinon-chai "sinon-chai") - Extends chai with assertions for the sinon

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

**Simple Test** reduces the amount of code required to unit test (and time)!  The simple example without **Simple Test** is shown below.  The unit test code has reduced by over 40%, and this is for a very simple controller without dependencies.  In a typcial application, this substantially reduces the amount of time spent writing unit tests.

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
	            angularController = $controller('personController');
	            $scope.vm = angularController;
	        });
	        it('Should have a scope', function () {
	            $scope.should.exist;
	        });
	        it('Should contain the person data', function () {
	            $scope.vm.person.should.equal(personData);
	        });
	    });
	});

```

### Enforces Code Standards
The **Simple Test** framework has been written to follow [John Papa's Angular Style Guide](https://github.com/johnpapa/angular-styleguide "https://github.com/johnpapa/angular-styleguide"). This is an opinionated style guide for syntax, conventions, and structuring Angular applications.  **Simple Test** follows these conventions in setting out it's testing methods, for example there is a method `.backend('/api/person', personData)` that allows mocking a backend response.  While technically a developer can place a backend call withing a directive or controller, the style guide calls for the logic to reside in an angular factory [Style [Y060](https://github.com/johnpapa/angular-styleguide#style-y060)]. Therefore the `.backend('/api/person', personData)` is only avialble to test on the **Simple Test** `Factory` object, as shown in the following code example.

```javascript

	var
	    personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
	    personId = 1,
	    personPromise = sinon.stub().returnsPromise().resolves(personData),
	    factory,
	    result;
	
	_T.createModule('app.people.person')
	        .describe(function () {
	            this.addFactory('personDataService')
	                .backend('/api/person', personPromise)
	                .method('get', [personId], result)
	                .describe(function () {
	                    factory = this;
	                    it('Should get the person data', function () {
	                        result.should.be.equal(personData);
	                    });
	                });
	        });

```


## API

For more information view the [documentation](https://github.com/toddbadams/simple-test/wiki "https://github.com/toddbadams/simple-test/wiki").
