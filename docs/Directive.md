
## What is the Module?

The `Module` is a _T object the contains the angular module under test as well as various properties and methods that aid in the unit test of an angular module.

Each of the `Module` methods are fluent, returning the module itself, thus allow for chaining of methods, as shown.

```javascript
	var myModule;
	_T.createModule('someAngularModule')
		.describe(function(){
			myModule = this;
		});
```

In this example a `Module` is created with `_T.createModule('someAngularModule')` and then it's `describe` method is called.  The describe method takes a function which is bound to the `Module` object just created.


## When to use a Module?

Use a `Module`:

1. At the start of every set of unit tests.



## Constructor


#### `_T.createModule(name, title [optional])`

#### `name`
The name of the angular module.

#### `title` [optional]
A title to display when running tests under this module. It is defaulted to (name + ' module').


## Read-Only Properties

#### `angularModule` 
A title to display when running tests under this module. It is defaulted to (name + ' module'). A angular module is a collection of services, directives, controllers, filters, and configuration information.

#### `controllers` 
A hashed object of controllers under test within the module.

#### `directives` 
A hashed object of controllers under test within the module.

#### `name` 
The name of the angular module.

#### `services` 
A hashed object of controllers under test within the module.

#### `title` 
A title to display when running tests under this module. It is defaulted to (name + ' module').

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

#### `$rootScope` 
The angular `$rootScope` object (available only within the `describe` methods' `testFn`). Every application has a single root scope. All other scopes are descendant scopes of the root scope. 


## Methods

#### `addController(name, title [optional])` 
Creates the `Controller` object.  name is the angular controller name, and title is an optional display title.  The title is defaulted to (name + ' Controller').

```javascript
	_T.createModule('someAngularModule')
		.describe(function(){
			this.addController('myCoolController')
				.describe(function() {
					// do some controller testing
				});
		});
```

#### `addDirective(name, title [optional])` [read only]
Creates the `Directive` object.  name is the angular controller name, and title is an optional display title.  The title is defaulted to (name + ' Directive').

```javascript
	_T.createModule('someAngularModule')
		.describe(function(){
			this.addDirective('myCoolDirective')
				.describe(function() {
					// do some directive testing
				});
		});
```

#### `addService(name, title [optional])` 
Creates the `Service` object.  name is the angular controller name, and title is an optional display title.  The title is defaulted to (name + ' Service').  This method can be used to test angular services, factories, and filters.

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

#### `dumpLogsOnTeardown()` 
If added the contents of each of the `$log` logs will be written to the console during the module teardown.

#### `inject([mod1, mod2, ...])` 
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