# simple-test
Simplied angular unit test api


## Controllers

### A simple controller
The following is a very simple controller that takes a single dependency and assigns it to the view model (vm).
```javascript
    (function () {
        angular.module('v.person.simple', [])
		    .controller('person', PersonController);

        PersonController.$inject = ['personData'];
        function PersonController(personData) {
            var vm = this;
            vm.person = personData;
        }
    })();

```

This is then tested with the following spec file.

```javascript
1    var
2        personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
3        controller;
4
5    _T.addModule('v.person.simple')
6        .describe(function() {
7            this.addController('person')
8                .controllerAs('vm')
9                .inject({
10                    'personData': personData
11               })
12                .describe(function() {
13                    controller = this;
14
15                    it('Should contain the person data', function() {
16                        controller.scope.vm.person
17                           .should.be.equal(personData);
18                    });
19                });
20        });
```

The main object is _T, and line 5 defines the angular module to be tested.  Line 6 then defines the describe block to be tested for the module and passes into it's function the test module.

The Module has the following API
```
<dl>
  <dt>"Module" API</dt>
  <dd>The module under test object.</dd>

  <dt>addController</dt>
  <dd>controller = module.addController('person')</dd>
</dl>
```
