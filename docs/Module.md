
## What is the ModuleTest?

The `ModuleTest` is a _T object the contains the angular module under test as well as various properties and methods that aid in the unit test of an angular module.

Each of the `ModuleTest` methods are fluent, returning the module itself, thus allow for chaining of methods. The following code sample is located at: [https://github.com/toddbadams/simple-test/tree/master/samples/ModuleTest](https://github.com/toddbadams/simple-test/tree/master/samples/ModuleTest)

### The Module Under Test
```javascript
    angular.module('myModule', [])
        .value('mySpecialObject', { id: 123 })
        .constant('myConstant', 456);
```

### The Module Specification
```javascript
_T.createModuleTest('myModule')
    .describe(function() {
        var myModuleTest = this;
        it('mySpecialObject should have id of 123', function () {
            var result = myModuleTest.$injector.get('mySpecialObject');
            result.id.should.equal(123);
        });
        it('myConstant should have value of 456', function() {
            var result = myModuleTest.$injector.get('myConstant');
            result.should.equal(456);
        });
    });
```

In this example a `ModuleTest` is created with `_T.createModuleTest('myModule')` and then it's `describe` method is called.  The describe method takes a function which is bound to the `ModuleTest` object just created.




## When to use a ModuleTest?

Use a `ModuleTest`:

1. At the start of every set of unit tests.



## Constructor

#### `_T.createModule(name, title [optional])`

#### `name`
The name of the angular module.

#### `title` [optional]
A title to display when running tests under this module. It is defaulted to (name + ' module').



## Read-Only Properties

#### `angularModule` 
The angular module under test.  An angular module is a collection of services, directives, controllers, filters, and configuration information.

#### `controllerTests` 
A hashed object of `_T` controller test objects.

#### `directiveTests` 
A hashed object of `_T` directive test objects.

#### `injectedModules` 
A hashed object of injected angular modules.


#### `name` 
The name of the angular module.

#### `serviceTests` 
A hashed object of `_T` service test objects.

#### `title` 
A title to display when running tests under this module. 

#### `$compile` 
The angular `$compile` object **(available only within `describe(testFn)`)**. Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link a scope and template together.

#### `$controller` 
The angular `$controller` object **(available only within the `describe(testFn)`)**. An angular service responsible for instantiating controllers.

#### `$httpBackend` 
The angular `$httpBackend` object **(available only within the `describe(testFn)`)**. A fake HTTP backend using angular mocks.

#### `$injector` 
The angular `$injector` object **(available only within the `describe(testFn)`)**. It is used to retrieve object instances.

#### `$log` 
The angular `$log` object **(available only within the `describe(testFn)`)**. Mock implementation of $log that gathers all logged messages in arrays (one array per logging level). These arrays are exposed as logs property of each of the level-specific log function, e.g. for level error the array is exposed as $log.error.logs.

#### `$q` 
The angular `$q` object **(available only within the `describe(testFn)`)**. This is angular's promise function.

#### `$rootScope` 
The angular `$rootScope` object **(available only within the `describe(testFn)`)**. Every application has a single root scope. All other scopes are descendant scopes of the root scope. 



## Methods

#### `createControllerTest(name, title [optional])`  (TBD)
Creates the `ControllerTest` object.  name is the angular controller name, and title is an optional display title.  The title is defaulted to (name + ' Controller').

```javascript
	_T.createModuleTest('someAngularModule')
		.describe(function(){
			this.createControllerTest('myCoolController')
				.describe(function() {
					// do some controller testing
				});
		});
```

#### `createDirectiveTest(name, title [optional])`  (TBD)
Creates the `DirectiveTest` object.  name is the angular controller name, and title is an optional display title.  The title is defaulted to (name + ' Directive').

```javascript
	_T.createModule('someAngularModule')
		.describe(function(){
			this.addDirective('myCoolDirective')
				.describe(function() {
					// do some directive testing
				});
		});
```

#### `createServiceTest(name, title [optional])` 
Creates the `ServiceTest` object.  name is the angular controller name, and title is an optional display title.  The title is defaulted to (name + ' Service').  This method can be used to test angular services, factories, values, constands, and filters.

```javascript
	_T.createModule('someAngularModule')
		.describe(function(){
			this.addService('myCoolService')
				.describe(function() {
					// do some filter testing
				});
		});
```

#### `describe(testFn, title [optional])` 
Instantiates a mocha `describe` block with the optional display title. 

A mocha `beforeEach` is instantiated which creates the angular module as a mock using angular mocks, which is then added as a property of the `Module`  as `angularModule`.  Additionally the following angular specific objects/functions are added as properties on the `Module`, which facilitate testing within the `testFn` function.

After the `testFn` function completes a module level tear down function is run, based upon settings (see `dumpLogsOnTeardown()`). 

The `testFn` is run immediately, so settings such as `dumpLogsOnTeardown` should be defined prior to the `describe` method.

#### `dumpLogsOnTeardown()`  (TBD)
If added the contents of each of the `$log` logs will be written to the console during the module teardown.

#### `inject([mod1, mod2, ...])`  (TBD)
Creates a number of empty angular modules with the names provided, such as mod1, mod2, etc.  If the module under test has a dependency on second module, the second module is listed in the inject array.  This replaces it (if it exists) with an empty module, thus allowing the services, directives, controllers, filters, and configuration information to be stubbed or mocked.  For example a module defined in code as:

```javascript
	angular.module('someAngularModule', ['secondModule']);
```

defines an angular module with the name 'someAngularModule', which has a dependency on another module 'secondModule'.  The test module should then be defined as:

```javascript
	_T.createModule('someAngularModule')
		.inject('secondModule')
		.describe(function(){
			// test some stuff...
		});
```