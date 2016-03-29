/**
 * Todd's javascript test helpers
 * 
 * Requires:  
 *  mocha https://mochajs.org/      JavaScript test framework
 *  chai  http://chaijs.com/        BDD / TDD assertion library
 *  sinon http://sinonjs.org/       Standalone test spies, stubs and mocks for JavaScript
 *  angular, angular mocks  https://angularjs.org/
 * 
 */
(function (angular, mocha, chai, sinon) {
    "use strict";

    var publicApi = {
        createModuleTest: function (name, title) {
            return new ModuleTest(name, title);
        },
        run: run
    };


    /**
     * The ModuleTest Object
     */
    var ModuleTest = (function () {
        /**
         * An angular module to test
         * @param {} name - The name of the angular module.
         * @param {} title - (optional) A title to display when running tests under this module.
         * @returns {} - the module test object
         */
        var test = function (name, title) {
            this.name = name;
            this.title = title || name + ' Module';
            this.serviceTests = {};
            this.controllerTests = {};
            this.directiveTests = {};
            this.angularModule = null;
            this.injectedModules = {};
            this.moduleDependencies = [];
            this.serviceDependencies = [];

            this.$injector = null;
            this.$compile = null;
            this.$controller = null;
            this.$rootScope = null;
            this.$httpBackend = null;
            this.$q = null;
            this.$log = null;
            this.$templateCache = null;

            testsMixin(this);
            return this;
        }

        test.prototype.describe = function (test) {
            var self = this;
            describe(self.title, function () {
                beforeEach(function () {
                    try {
                        setupAngularModule(self);
                    } catch (err) {
                        console.log(err);
                        throw err;
                    }
                });
                afterEach(function () {
                    tearDownAngularModule(self);
                });
                it(self.name + ' should exist as an angular module', function () {
                    angular.module(self.name).should.exist;
                });
                if (test) self.addTest(test)();
            });
            return self;
        }

        test.prototype.createControllerTest = function (name, title) {
            this.controllerTests[name] = new ControllerTest(this, name, title);
            return this.controllerTests[name];
        }

        test.prototype.createDirectiveTest = function (name, attributes, title) {
            this.directiveTests[name] = new DirectiveTest(this, name, attributes, title);
            return this.directiveTests[name];
        }

        test.prototype.createServiceTest = function (name, title) {
            this.serviceTests[name] = new ServiceTest(this, name, title);
            return this.serviceTests[name];
        }

        test.prototype.injectModule = function (name) {
            this.moduleDependencies.push(new ModuleDependency(name, this));
            return this;
        }

        test.prototype.injectService = function (dependencyModel) {
            this.serviceDependencies.push(new ServiceDependency(dependencyModel, this));
            return this;
        }

        function setupAngularModule(self) {
            // first inject dependent modules
            createDependancies(self.moduleDependencies);
            // second create the module under test as a mock
           // angular.mock.module.apply(this, createModuleMockParams(self));
            angular.mock.module(self.name);
            self.angularModule = angular.module(self.name);
            // finially create anonymous (no module) services
            createDependancies(self.serviceDependencies);
            inject(function ($injector) {
                self.$injector = $injector;
                self.$compile = $injector.get('$compile');
                self.$controller = $injector.get('$controller');
                self.$rootScope = $injector.get('$rootScope');
                self.$httpBackend = $injector.get('$httpBackend');
                self.$q = $injector.get('$q');
                self.$log = $injector.get('$log');
                self.$templateCache = $injector.get('$templateCache');
            });

        }

        function tearDownAngularModule(self) {
            if (self.$log && self.$log.debug.logs.length > 1) console.log('debug: ' + self.$log.debug.logs);
            if (self.$log && self.$log.error.logs.length > 1) console.log('error: ' + self.$log.error.logs);
        }

        return test;
    })();


    /**
     * The ServiceTest Object
     */
    var ServiceTest = (function () {
        /**
         * An angular service or factory to test
         * @param {} module - the angular module that contains the service
         * @param {} name - the angular service or factory name
         * @returns {} - the service or factory test object
         */
        var test = function (moduleTest, name, title) {
            this.angularService = null;
            this.moduleTest = moduleTest;
            this.name = name;
            this.title = title || name + ' Service';
            this.dependencies = [];
            testsMixin(this);
            return this;
        }

        test.prototype.describe = function (test) {
            var self = this;
            describe(self.title, function () {
                beforeEach(function () {
                    try {
                        createAngularService(self);
                    } catch (err) {
                        console.log(err);
                        throw err;
                    }
                });
                it('Should exist in module ' + self.moduleTest.name, function () {
                    self.moduleTest.$injector.has(self.name).should.be.true;
                });
                if (test) self.addTest(test)();
            });
            return this;
        }

        test.prototype.injectService = function (dependencyModel) {
            this.moduleTest.serviceDependencies.push(new ServiceDependency(dependencyModel, this));
            return this;
        }

        test.prototype.httpMethod = function (method, params, options) {
            var self = this,
                result;
            // mocks the backend response
            self.moduleTest.$httpBackend
                .when(options.method, options.url)
                .respond(function () {
                    return [200, options.response];
                });

            // call the service method
            if (angular.isArray(params)) {
                // params is an array of parameters to pass to the method, use apply()
                self.angularService[method].apply(self.angularService, params)
                    .then(function (data) {
                        result = data;
                    });
            } else {
                // params is a single parameter, send it to the method
                self.angularService[method](params)
                    .then(function (data) {
                        result = data;
                    });
            }

            // flush the $http backend
            self.moduleTest.$httpBackend.flush();
            return result;
        }


        function createAngularService(self) {
            if (!self.moduleTest.$injector.has(self.name)) {
                throw new Texception('Cannot create service, it does not exist within the ' + module.name + ' module.');
            };
            self.angularService = self.moduleTest.$injector.get(self.name);
        }

        return test;
    })();

    /**
     * The ControllerTest Object
     */
    var ControllerTest = (function () {

        /**
         * An angular controller test
         * @param {} moduleTest - The parent `ModuleTest` object.
         * @param {} name - The name of the angular controller.
         * @param {} title - A title to display when running tests under this controller.
         * @returns {} - the controller test object
         */
        var test = function (moduleTest, name, title) {
            this.moduleTest = moduleTest;
            this.name = name;
            this.title = title || name + ' Controller';
            this.serviceDependencies = [];
            this.scope = null;
            testsMixin(this);
            this.controllerAsName = null;
            return this;
        }
        test.prototype.controllerAs = function (name) {
            this.controllerAsName = name;
            return this;
        }

        test.prototype.describe = function (test) {
            var self = this;
            describe(self.title, function () {
                beforeEach(function () {
                    try {
                        createAngularController(self);
                    } catch (err) {
                        console.log(err);
                        throw err;
                    }
                });
                it('Should have a scope', function () {
                    self.scope.should.exist;
                });
                if (self.controllerAsName) {
                    it('Should have a view model named "' + self.controllerAsName + '" on the scope', function () {
                        self.scope[self.controllerAsName].should.exist;
                    });
                }
                if (test) self.addTest(test)();
            });
            return this;
        }

        test.prototype.injectService = function (dependencyModel) {
            this.serviceDependencies.push(new ServiceDependency(dependencyModel, this));
            return this;
        }


        function createAngularController(self) {
            self.scope = self.moduleTest.$rootScope.$new();
            var f = createDependencies(self.serviceDependencies);
            self.angularController = self.moduleTest.$controller(self.name, f);
            // if defined as controllerAs, then assign the angular controller on the scope
            if (self.controllerAsName && self.scope) {
                self.scope[self.controllerAsName] = self.angularController;
            }
        }

        function createDependencies(serviceDependencies) {
            var dependencies = {};
            serviceDependencies.forEach(function (dep) {
                dependencies[dep.serviceName] = dep.value;
            });
            return dependencies;
        }

        return test;
    })();



    /**
     * The DirectiveTest Object
     */
    var DirectiveTest = (function () {
        /**
         * An angular directive under test
         * @param {} module - the angular module that contains the directive
         * @param {} name - the angular directive
         * @returns {} - the directive test object
         */
        var test = function (moduleTest, name, attributes, title) {
            this.angularDirective = null;
            this.moduleTest = moduleTest;
            this.name = name;
            this.attributes = attributes;
            this.title = title || name + ' Directive';
            this.dependencies = [];
            testsMixin(this);
            return this;
        }

        test.prototype.withTemplateUrl = function (templateUrl) {
            this.templateUrl = templateUrl;
            return this;
        }


        test.prototype.withParentScope = function (parentScopeObj) {
            this.parentScopeObj = parentScopeObj;
            return this;
        }

        test.prototype.describe = function (test) {
            var self = this;
            describe(self.title, function () {
                beforeEach(function () {
                    createAngularDirective(self);
                });
                it('Should have a parent scope ', function () {
                    self.parentScope.should.exist;
                });
                it('Should have a scope ', function () {
                    self.scope.should.exist;
                });
                if (test) self.addTest(test)();
            });
            return this;
        }

        test.prototype.injectService = function (dependencyModel) {
            this.moduleTest.serviceDependencies.push(new ServiceDependency(dependencyModel, this));
            return this;
        }

        function createAngularDirective(self) {
            //if (!self.moduleTest.$injector.has(self.name)) {
            //    throw new Texception('Cannot create service, it does not exist within the ' + module.name + ' module.');
            //};
            // parent scope
            self.parentScope = self.moduleTest.$rootScope.$new();
            angular.extend(self.parentScope, self.parentScopeObj);
            // html text
            self.html = createHtmlTag(self.name, self.attributes);
            // allow http backend to access the template file
            AddTemplateToCache(self);
            // dom element
            self.element = self.moduleTest.$compile(self.html)(self.parentScope);
            // cycle the digest
            self.parentScope.$digest();
            // get the directive's scope
            self.angularDirective = self.element.isolateScope();
            self.scope = self.angularDirective;
        }

        function AddTemplateToCache(self) {
            if (!self.templateUrl) return;
            var directiveTemplate = null;
            var req = new XMLHttpRequest();
            req.onload = function () {
                directiveTemplate = this.responseText;
            };
            // Note that the relative path may be different from your unit test HTML file.
            // Using `false` as the third parameter to open() makes the operation synchronous.
            // Gentle reminder that boolean parameters are not the best API choice.
            req.open("get", self.templateUrl.unitTestPath, false);
            req.send();
            self.moduleTest.$templateCache.put(self.templateUrl.directivePath, directiveTemplate);
        }
        
        function createHtmlTag(name, attributes) {
            var html = '<' + name + ' ';
            attributes.forEach(function(attr) {
                html += attr.key + '="' + attr.value + '" ';
            });
            html += '></' + name + '>';
            return html;
        }

        return test;
    })();


    /**
     * A dependent module
     */
    var ModuleDependency = (function () {

        var dependency = function (name, moduleTest) {
            this.name = name;
            this.moduleTest = moduleTest;
            return this;
        }
        dependency.prototype.inject = function () {
            // todo: should be able to use angular.mock.module(this.name)
            // todo:    however it does not appear to setup the module, WHY?
            angular.module(this.name, []);
            return this;
        }
        return dependency;

    })();

    /**
     * A dependent service
     */
    var ServiceDependency = (function () {

        var dependency = function (model) {
            if (!model.hasOwnProperty('name')) {
                throw new Texception('Cannot create dependency, must have service property.');
            }
            this.serviceName = model.name;
            if (!model.hasOwnProperty('value')) {
                throw new Texception('Cannot create dependency, must have value property.');
            }
            this.value = model.value;
            return this;
        }
        dependency.prototype.inject = function () {
            var m = {};
            m[this.serviceName] = this.value;
            angular.mock.module(m);
            return this;
        }
        return dependency;

    })();

    /**
     * A mixin to permit an object to maintain an array of tests (methods/functions)
     * @param {} obj - the object that gets the tests
     */
    function testsMixin(obj) {
        obj.tests = [];

        /**
         * clears out the object tests and sets the name of each
         * @param {} testFn - a test function
         * @returns {} - self
         */
        obj.addTest = (function (testFn) {
            if (!angular.isFunction(testFn)) {
                throw new Texception('Cannot create test, testFn must be a function.');
            }
            var t = testFn.bind(obj);
            obj.tests.push(t);
            return t;
        }).bind(obj);
    }
    /*
     *  Phantom.js does not support Function.prototype.bind (at least not before v.2.0)
     *  That's just crazy. Everybody supports bind.
     *  Read about it here: https://groups.google.com/forum/#!msg/phantomjs/r0hPOmnCUpc/uxusqsl2LNoJ
     *  This bind polyfill is copied directly from MDN
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
     */
    (function () {
        if (Function.prototype.bind) {
            return;
        } // already defined

        /*jshint freeze: false */
        Function.prototype.bind = function (oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError(
                    'Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FuncNoOp = function () { },
                fBound = function () {
                    return fToBind.apply(this instanceof FuncNoOp && oThis ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            FuncNoOp.prototype = this.prototype;
            fBound.prototype = new FuncNoOp();

            return fBound;
        };
    })();

    /**
     * taken and modified from: https://github.com/substantial/sinon-stub-promise/blob/master/index.js
     * @returns {} 
     */
    (function (sinon) {
        sinon.stub.returnsPromise = function () {
            var self = this;
            self.resolved = false;
            self.resolves = resolves;
            self.resolveValue = null;
            self.rejected = false;
            self.rejects = rejects;
            self.rejectValue = null;
            self.returns({
                then: then
            });

            function then(onFulfill, onReject) {
                // resolved
                if (self.resolved && !self.rejected) {
                    var returned = onFulfill(self.resolveValue);

                    // promise returned, return that for next handler in chain
                    if (returned && returned.then) {
                        return returned;
                    }

                    // update resolve value for next promise in chain
                    self.resolveValue = returned;

                    return self;
                }

                // rejected
                if (self.rejected && onReject) {
                    onReject(self.rejectValue);
                    return self;
                }

                // not yet resolved or rejected
                return self;
            }

            function resolves(value) {
                self.resolved = true;
                self.rejected = false;
                self.resolveValue = value;
                return self;
            }

            function rejects(value) {
                self.rejected = true;
                self.resolved = false;
                self.rejectValue = value;
                return self;
            }

            return self;
        };
    }(sinon));

    /** PRIVATE METHODS ****************************************************/

    function createDependancies(dependencies, $provide) {
        if (!dependencies || dependencies.length < 1) return;
        dependencies.forEach(function (dependency) {
            // only inject if it does not already exist
            try {
                angular.module(dependency);
            } catch (err) {
                dependency.inject($provide);
            }
        });
    }

    /**
     * After setup, run the specs
     */
    function run() {
        // run mocha
        mocha.run();

        // before each spec setup common stuff
        beforeEach(function () {
            window._T = publicApi;
        });

        // and after each spec tear down
        afterEach(function () {

        });
    }

    var Texception = (function () {
        /**
         * exception object
         * @param {} message - an exception message
         * @returns {} the _Texception object
         */
        function e(message) {
            this.name = '_Texception';
            this.message = message;
        }
        e.prototype = new Error();
        e.prototype.constructor = e;

        return e;
    })();

    /** ACTIVATE THIS MODULE **/
    // place public methods on window
    window._T = publicApi;


})(angular, mocha, chai, sinon);