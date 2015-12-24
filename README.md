# simple-test
Simplied angular unit testing .

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

## API

For more information view the [documentation](https://github.com/toddbadams/simple-test/wiki "https://github.com/toddbadams/simple-test/wiki").
