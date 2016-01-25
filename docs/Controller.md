
## What is the ControllerTest?

The `ControllerTest` is a _T object the contains the angular controller under test as well as various properties and methods that aid in the unit test of an angular module.

Each of the `ControllerTest` methods are fluent, returning itself, thus allow for chaining of methods.The following code sample is located at: [https://github.com/toddbadams/simple-test/tree/master/samples/controllers](https://github.com/toddbadams/simple-test/tree/master/samples/controllers)

### The Controller Under Test
```javascript

```

### The Controller Specification
```javascript

```

In this example a `ModuleTest` is created with `_T.createModuleTest('someAngularModule')` and then it's `describe` method is called.  This describe method takes a function which is bound to the `Module` object just created. 

A  `ControllerTest` is created with `this.createControllerTest('myCoolController')` and then it's `describe` method is called. This describe method takes a function which is bound to the `ControllerTest` object just created. 


## When to use a ControllerTest?

Use a `ControllerTest`:

1. At the start of every set of unit tests that cover an angular controller.


## Constructor


#### `moduleTest.createControllerTest(name, title [optional])`

#### `name`
The name of the angular controller.

#### `title` [optional]
A title to display when running tests under this controller. It is defaulted to (name + ' controller').


## Read-Only Properties

#### `Module` 
An angular module is a collection of services, directives, controllers, filters, and configuration information.

#### `ModuleTest` 
The parent `ModuleTest` object.

#### `name` 
The name of the angular controller.

#### `title` 
A title to display when running tests under this controller. 

#### `$compile` 
The angular `$compile` object (available only within the `describe` methods' `testFn`). Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link a scope and template together.

#### `$controller` 
The angular `$controller` object (available only within the `describe` methods' `testFn`). An angular service responsible for instantiating controllers.

#### `$httpBackend` 
The angular `$httpBackend` object (available only within the `describe` methods' `testFn`). A fake HTTP backend using angular mocks.

#### `$injector` 
The angular `$injector` object (available only within the `describe` methods' `testFn`). It is used to retrieve object instances.

#### `$log` 
The angular `$log` object (available only within the `describe` methods' `testFn`). Mock implementation of $log that gathers all logged messages in arrays (one array per logging level). These arrays are exposed as logs property of each of the level-specific log function, e.g. for level error the array is exposed as $log.error.logs.

#### `$q` 
The angular `$q` object (available only within the `describe` methods' `testFn`). This is angular's promise function.

#### `$scope` 
The angular `$scope` object (available only within the `describe` methods' `testFn`).  


## Methods

#### `describe(testFn, title [optional])` 
Instantiates a mocha `describe` block with the optional display title. 

A mocha `beforeEach` is instantiated which creates the angular module as a mock using angular mocks, which is then added as a property of the `Module`  as `angularModule`.  Additionally the following angular specific objects/functions are added as properties on the `Module`, which facilitate testing within the `testFn` function.

After the `testFn` function completes a module level tear down function is run, based upon settings (see `dumpLogsOnTeardown()`). 

The `testFn` is run immediately, so settings such as `dumpLogsOnTeardown` should be defined prior to the `describe` method.

#### `inject([service1, service2, ...])` 
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