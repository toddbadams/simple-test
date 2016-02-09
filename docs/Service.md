
## What is the ServiceTest?

The `ServiceTest` is a _T object the contains the angular service under test as well as various properties and methods that aid in the unit test of an angular module.

Each of the `ServiceTest` methods are fluent, allow for chaining of methods. The following code sample is located at: [https://github.com/toddbadams/simple-test/tree/master/samples/LoggingService](https://github.com/toddbadams/simple-test/tree/master/samples/LoggingService)

## A Logging Service Example
The following example illustrates a a logging service which has dependencies on two other services.  the `$log` service is an angular service, and the `toaster` service is an internal or 3rd party service that displays the message in a toast style pop-up.

### The Service Under Test

```javascript
(function () {
    'use strict';

    angular.module('s.logging', ['ng'])
        .config(config)
        .constant('loggingDebugEnabled', true)
		.factory('loggingService', loggingService);

    /**
     * Module configuration
     */
    config.$inject = ['$logProvider', 'loggingDebugEnabled'];
    function config($logProvider, loggingDebugEnabled) {
        $logProvider.debugEnabled(loggingDebugEnabled);
    }

    /**
     * The logging service
     */
    loggingService.$inject = ['$log','toaster'];
    function loggingService($log, toaster) {

        function log(method, message, data, source) {
            // log to angular
            $log[method]({
                message: message,
                data: data,
                source: source
            });
            // send message to toaster
            toaster[method](message);
        }

        function logger(source) {
            return {
                debug: function (message, data) {
                    return log('debug', message, data, source);
                },
                error: function (message, data) {
                    return log('error', message, data, source);
                }
            };
        }

        return {
            logger: logger
        }
    }
})();
```

### The Service Specification
```javascript
    var
    message = '854b61fb-5ed1-4bfc-99e5-02e82ed982be',
    data = 'e19b6257-70a9-4ffb-9128-2b948135eb17',
    source = '40f51c9d-a654-4c1a-9a32-2b920068c3b7',
        
    toasterStub = {
        debug: sinon.stub(),
        error: sinon.stub()
    };

_T.createModuleTest('s.logging')
        .describe(function () {
            var loggingModule = this;

            this.createServiceTest('loggingDebugEnabled', 'loggingDebugEnabled Constant')
                .describe(function () {
                    var loggingDebugEnabledTest = this;
                    it('Should be true.', function () {
                        loggingDebugEnabledTest.angularService.should.true;
                    });
                });

            this.createServiceTest('loggingService')
                .injectService({ name: 'toaster', value: toasterStub })
                .describe(function () {
                    var logger,
                        loggingServiceTest = this;

                    beforeEach(function () {
                        logger = loggingServiceTest.angularService.logger(source);
                    });

                    describe('The debug method', function () {
                        beforeEach(function () {
                            logger.debug(message, data);
                        });

                        it('Should call $log.debug with a message.', function () {
                            loggingModule.$log.debug.logs.length.should.be.equal(1);
                            loggingModule.$log.debug.logs[0][0].should.eql({
                                message: message,
                                data: data,
                                source: source
                            });
                        });

                        it('Should call toast.debug with a message.', function () {
                            toasterStub.debug.should.have.been.calledWith(message);
                        });
                    });

                    describe('The error method', function () {
                        beforeEach(function () {
                            logger.error(message, data);
                        });

                        it('Should call $log.error with a message.', function () {
                            loggingModule.$log.error.logs.length.should.be.equal(1);
                            loggingModule.$log.error.logs[0][0].should.eql({
                                message: message,
                                data: data,
                                source: source
                            });
                        });

                        it('Should call toast.error with a message.', function () {
                            toasterStub.error.should.have.been.calledWith(message);
                        });
                    });
                });
        });
```

In this example a `ModuleTest` is created with `_T.createModuleTest(LOGGING_MODULE_NAME)` and then it's `describe` method is called.  This describe method takes a function which is bound to the `ModuleTest` object just created and is assigned to `loggingModule`.

### Testing The Constant
A `ServiceTest` is created with `this.createServiceTest(LOGGING_DEBUG_ENABLED_CONSTANT, 'loggingDebugEnabled Constant')` and then it's `describe` method is called.  The describe method takes a function which is bound to the `ServiceTest` object just created  and is assigned to `loggingDebugEnabledTest`. Within the `loggingDebugEnabledTest` object the `angularService` property is accessed and tested with `loggingDebugEnabledTest.angularService.should.true;`.

## A Data Service Example
In this example a person object is consumed and updated via a REST API. In a more complex senario the model portion of this service can be abstracted into a seperate service, however for the sake of demonstration, the model and the backend calls are in this service. 

### The Service Under Test
```javascript
(function () {
    'use strict';

    angular.module('s.data', ['ng'])
		.factory('dataService', dataService);

    /**
     * The data service
     */
    dataService.$inject = ['$http'];
    function dataService($http) {

        function getPerson(id) {
            return $http({
                    method: 'GET',
                    url: 'http://api.samples.com/person/' + id
                }).
                then(function(result) {
                    return new Person(result.data);
                });
        }

        function updatePerson(id, person) {
            return $http({
                    method: 'PUT',
                    url: 'http://api.samples.com/person/' + id,
                    data: person.toPutModel()
                }).
                then(function(result) {
                    return new Person(result.data);
                });
        }

        function createPerson(data) {
            return new Person(data);
        }

        return {
            getPerson: getPerson,
            updatePerson: updatePerson,
            createPerson: createPerson
        }
    }

    var Person = (function () {
        var p = function (data) {
            this.first = data.first;
            this.last = data.last;
            this.full = this.first + ' ' + this.last;
            this.dob = new Date(data.dob);
            return this;
        }
        p.prototype.age = function (date) {
            var ageDifMs = date - this.dob;
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        p.prototype.toPutModel = function() {
            return {
                first: this.first,
                last: this.last,
                dob: this.dob.toString()
            }
        }
        return p;
    })();
})();
```

### The Service Specification

```javascript
var
    id = 1,
    first = '854b61fb-5ed1-4bfc-99e5-02e82ed982be',
    last = 'e19b6257-70a9-4ffb-9128-2b948135eb17',
    dob = '1990-08-24';

_T.createModuleTest('s.data')
        .describe(function () {
            this.createServiceTest('dataService')
                .describe(function () {
                    var dataServiceTest = this,
                        result;

                    describe('The create method', function () {
                        beforeEach(function () {
                            result = dataServiceTest.angularService.createPerson({
                                first: first,
                                last: last,
                                dob: dob
                            });
                        });

                        it('Should return a valid full name.', function () {
                            result.full.should.be.equal(first + ' ' + last);
                        });

                        it('Should calculate the correct age.', function () {
                            var now = new Date(2016, 1, 15);
                            result.age(now).should.be.equal(25);
                        });
                    });

                    describe('The get method', function () {
                        beforeEach(function () {
                            result = dataServiceTest.httpMethod('getPerson', id, {
                                method: 'GET',
                                url: 'http://api.samples.com/person/' + id,
                                response: {
                                    first: first,
                                    last: last,
                                    dob: dob
                                }
                            });
                        });

                        it('Should return a valid full name.', function () {
                            result.full.should.be.equal(first + ' ' + last);
                        });

                        it('Should calculate the correct age.', function () {
                            var now = new Date(2016, 1, 15);
                            result.age(now).should.be.equal(25);
                        });
                    });

                    describe('The update method', function () {
                        beforeEach(function () {
                            var p = dataServiceTest.angularService.createPerson({
                                first: first,
                                last: last,
                                dob: dob
                            });
                            result = dataServiceTest.httpMethod('updatePerson', [id, p], {
                                method: 'PUT',
                                url: 'http://api.samples.com/person/' + id,
                                response: {
                                    first: first,
                                    last: last,
                                    dob: dob
                                }
                            });
                        });

                        it('Should return a valid full name.', function () {
                            result.full.should.be.equal(first + ' ' + last);
                        });

                        it('Should calculate the correct age.', function () {
                            var now = new Date(2016, 1, 15);
                            result.age(now).should.be.equal(25);
                        });
                    });
                });
        });
```

This specification defines the module, the service, then creates a describe block for each of the methods in the service; `createPerson`, `getPerson`, `updatePerson`. The following code is used to test a service method that is backed by an HTTP call:

 
```javascript
    beforeEach(function () {
        result = dataServiceTest.httpMethod('getPerson', id, {
            method: 'GET',
            url: 'http://api.samples.com/person/' + id,
            response: {
                first: first,
                last: last,
                dob: dob
            }
        });
    });

```

This calls the `getPerson` method of the angular service under test, and passes `id` as it's parameter.  This assumes the method returns a promise (see [https://github.com/johnpapa/angular-styleguide#style-y061](https://github.com/johnpapa/angular-styleguide#style-y061 "y061")). Prior to calling this method the http backend is setup with the appropriate response. Then after calling the method, the HTTP backend is flushed, the promised is resolved, and the results of the method or returned.

## When to use a ServiceTest?

Use a `ServiceTest`:

1. When testing an angular service, factory, value, constant, or filter.


## Constructor

#### `Module.createServiceTest(name, title [optional])`

#### `name`
The name of the angular service.

#### `title` [optional]
A title to display when running tests under this service. It is defaulted to (name + ' Service').



## Read-Only Properties

#### `angular Service` 
An angular Service can create a service of any type, whether it be a primitive, object literal, function, or even an instance of a custom type.


#### `moduleTest` 
The parent `_T` module test object.

#### `name` 
The name of the angular service.

#### `title` 
A title to display when running tests under this service. 




## Methods

#### `createMethodTest(name, args)` 
Creates the `MethodTest` object.  name is function name on the service.  args is an array of arguments to pass to the method.

#### `describe(testFn, title [optional])` 
Instantiates a mocha `describe` block with the optional display title. 

A mocha `beforeEach` is instantiated which creates the angular module as a mock using angular mocks, which is then added as a property of the `Module`  as `angularModule`.  Additionally the following angular specific objects/functions are added as properties on the `Module`, which facilitate testing within the `testFn` function.

After the `testFn` function completes a module level tear down function is run, based upon settings (see `dumpLogsOnTeardown()`). 

The `testFn` is run immediately, so settings such as `dumpLogsOnTeardown` should be defined prior to the `describe` method.

### `httpMethod(serviceMethodName, serviceMethodParams, options)`
See data services example.

#### `injectService({ name: 'myservice': value: { mymethod: sinon.stub() })` 
Unit testing means testing in isolation, so dependencies on a service should be mocked or stubbed.  The `injectService` creates a mocked service and inserts it into angular with `angular.mock.module({'myService': function() { return { mymethod: sinon.stub() }; })`.

With angular.JS we can have multiple modules within an application but there is only one injector. Adding two services with the same name, even from different modules, will result in the second service overriding the first.  This allows us to override previously registered services with mocked/stubbed versions for testing.

