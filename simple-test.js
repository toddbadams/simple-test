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
(function(angular, mocha, chai, sinon) {
    "use strict";

    var publicApi = {
            createModuleTest: function(name, title) {
                return new ModuleTest(name, title);
            },
            run: run
        },
        expectedData = {},
        dependantServices = {};

    /** PRIVATE METHODS ****************************************************/

    function addExpected(key, obj) {
        expectedData[key] = obj;
    }

    function expected(key) {
        return expectedData[key];
    }

    function addDependantService(key, obj) {
        dependantServices[key] = obj;
    }

    function dependantService(key) {
        return dependantServices[key];
    }
    /**
     * return a data set as a promise, useful for stubs
     * @param {} $q - angular's $q service
     * @param {} data - the data to return within the promise
     * @returns {} - a promise
     */
    function asPromise($q, data) {
        var deferred = $q.defer();
        deferred.resolve(data);
        return sinon ? sinon.stub().returns(deferred.promise) : null;
    }


    /**
     * After setup, run the specs
     */
    function run() {
        // run mocha
        mocha.run();

        // before each spec setup common stuff
        beforeEach(function() {
            window._T = publicApi;
        });

        // and after each spec tear down
        afterEach(function() {

        });
    }

    /**
     * check if a file exists at the passed url
     * @param {} url - the url to check
     * @returns {} - true if exists, else false
     */
    function urlExists(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    }



    /** PRIVATE CLASSES ****************************************************/

    /**
     * The ModuleTest Object
     */
    var ModuleTest = (function() {
        /**
         * An angular module to test
         * @param {} name - the angular module name
         * @returns {} - the module test object
         */
        var ModuleTest = function(name, title) {
            this.name = name;
            this.title = title || name + ' Module';
            this.services = {};
            this.serviceTests = {};
            this.controllers = {};
            this.directives = {};
            this.module = null;
            this.injectedModules = {};
            this.$injector = null;
            this.$compile = null;
            this.$controller = null;
            this.$rootScope = null;
            this.$httpBackend = null;
            this.$q = null;
            this.$log = null;
            testsMixin(this);
            dependenciesMixin(this);
            return this;
        }
        ModuleTest.prototype.describe = function(test) {
                var self = this;
                describe(self.title, function() {
                    beforeEach(function() {
                        setupAngularModule(self);
                    });
                    afterEach(function() {
                        tearDownAngularModule(self);
                    });
                    it(self.name + ' should exist as an angular module', function() {
                        angular.module(self.name).should.exist;
                    });
                    if (test) self.addTest(test)();
                });
                return self;
            }

        ModuleTest.prototype.addController = function(name, title) {
            this.controllers[name] = new Controller(this, name, title);
            return this.controllers[name];
        }
        ModuleTest.prototype.addDirective = function(name, title) {
            this.directives[name] = new Directive(this, name, title);
            return this.directives[name];
        }
        ModuleTest.prototype.createServiceTest = function(name, title) {
            this.serviceTests[name] = new ServiceTest(this, name, title);
            return this.serviceTests[name];
        }


        function setupAngularModule(self) {
            createDependantModules(self);
            angular.mock.module(self.name);
            self.module = angular.module(self.name);
            inject(function($injector) {
                self.$injector = $injector;
                self.$compile = $injector.get('$compile');
                self.$controller = $injector.get('$controller');
                self.$rootScope = $injector.get('$rootScope');
                self.$httpBackend = $injector.get('$httpBackend');
                self.$q = $injector.get('$q');
                self.$log = $injector.get('$log');
            });
        }

        function tearDownAngularModule(self) {
            if (self.$log.debug.logs.length > 1) console.log('debug: ' + self.$log.debug.logs);
            if (self.$log.error.logs.length > 1) console.log('error: ' + self.$log.error.logs);
        }

        function createDependantModules(self) {
            if (!self.dependencies) return;
            angular.forEach(self.dependencies, function(moduleName) {
                self.injectedModules[moduleName] = angular.module(moduleName, []);
            });
        }

        return ModuleTest;
    })();


    /**
     * Test a single UI Router state
     * @param {} name - the state name
     * @param {} expected - the expected state values
     */
    function uiRouterStateTest(name, expected) {
        describe(name + ' State', function() {
            var state = null;

            it('Should exist', function() {
                // if the module has dependency on ui router 
                if (_T.$state) {
                    _T.$state.get()
                        .forEach(function(element, index, array) {
                            if (element.name === name) {
                                state = element;
                                return;
                            }
                        });
                }
                expect(state).to.exist;
            });
            if (expected.abstract) {
                it('Should have correct abstract value of ' + expected.abstract, function() {
                    expect(state.abstract).to.equal(expected.abstract);
                });
            }
            if (expected.controller) {
                it('Should have correct controller value of ' + expected.controller, function() {
                    expect(state.controller).to.equal(expected.controller);
                });
            }
            if (expected.url) {
                it('Should have correct URL value of ' + expected.url, function() {
                    expect(state.url).to.equal(expected.url);
                });
            }
            if (expected.templateUrl) {
                it.skip('Should have correct templateUrl value of ' + expected.templateUrl, function() {
                    state.templateUrl.toLowerCase().should.equal(expected.templateUrl.toLowerCase());
                });
                it.skip('Should have file located at the templateUrl value of ' + expected.templateUrl, function() {
                    urlExists('/src' + state.templateUrl).should.be.true;
                });
            }
        });
    }

    function base(obj, name, title) {
        obj.name = name;
        obj.title = title;
        obj.stubNames = [];
        obj.stubs = {};
        obj.injectedWith = injectedWith.bind(obj);
        obj.getStubs = getStubs.bind(obj);
        obj.getScope = getScope.bind(obj);

        function injectedWith(stubs) {
            this.stubNames = stubs;
            return this;
        }

        function getStubs() {
            var self = this;
            self.stubNames.forEach(function(element) {
                self.stubs[element] = _T.currentModule.stubData[element];
            });
        }

        function getScope() {
            this.scope = _T.$rootScope.$new();
            _T.currentScope = this.scope;
            return this.scope;
        }
    }

    /**
     * A mixin to permit an object to maintain a scope
     * @param {} obj - the object that gets the scope
     */
    function scopeMixin(obj) {
        obj.scope = null;

        /**
         * creates a scope from the $rootScope
         * @returns {} - self
         */
        obj.createScope = (function() {
            obj.scope = obj.module.$rootScope.$new();
            // if our object has dependencies then add the scope as a dependency
            if (obj.dependencies) obj.dependencies['$scope'] = obj.scope;
            return obj;
        }).bind(obj);
    }

    /**
     * A mixin to permit an object to maintain a hashed set of dependent services (methods/functions)
     * @param {} obj - the object that gets the dependencies
     */
    function dependenciesMixin(obj) {
        obj.dependencies = {};

        /**
         * clears out the object dependencies and sets the name of each
         * @param {} names - an array of strings - each is the name of a dependency
         * @returns {} - self
         */
        obj.inject = (function(dependencies) {
            if (!angular.isObject(dependencies)) {
                throw new Texception('Cannot create dependencies, names must be an object.');
            }
            obj.dependencies = {};
            angular.forEach(dependencies, function(value, key) {
                obj.dependencies[key] = value;
            });
            // if our object has a scope then add it as a dependency
            if (obj.scope) obj.dependencies['$scope'] = obj.scope;
            return obj;
        }).bind(obj);
    }

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
        obj.addTest = (function(testFn) {
            if (!angular.isFunction(testFn)) {
                throw new Texception('Cannot create test, testFn must be a function.');
            }
            var t = testFn.bind(obj);
            obj.tests.push(t);
            return t;
        }).bind(obj);
    }

    var ControllerTest = (function() {

        /**
         * An angular controller to test
         * @param {} name - the angular controller name
         * @returns {} - the controller test object
         */
        var controller = function(module, name, title) {
            this.module = module;
            this.name = name;
            this.title = title || name + ' Controller';
            dependenciesMixin(this);
            testsMixin(this);
            scopeMixin(this);
            this.controllerAsName = null;
            return this;
        }
        controller.prototype.createAngularController = function() {
            var self = this;
            self.createScope();
            self.angularController = self.module.$controller(self.name, self.dependencies);
            // if defined as controllerAs, then assign the angular controller on the scope
            if (self.controllerAsName && self.scope) {
                self.scope[self.controllerAsName] = self.angularController;
            }
        }
        controller.prototype.controllerAs = function(name) {
            this.controllerAsName = name;
            return this;
        }
        controller.prototype.describe = function(test) {
            var self = this;
            describe(self.title, function() {
                beforeEach(function() {
                    self.createAngularController();
                });
                it('Should have a scope', function() {
                    self.scope.should.exist;
                });
                if (test) self.addTest(test)();
            });
            return this;
        }

        return controller;
    })();


    /**
     * The ServiceTest Object
     */
    var ServiceTest = (function() {
        /**
         * An angular service or factory to test
         * @param {} module - the angular module that contains the service
         * @param {} name - the angular service or factory name
         * @returns {} - the service or factory test object
         */
        var ServiceTest = function(moduleTest, name, title) {
            this.moduleTest = moduleTest;
            this.module = moduleTest.module;
            this.name = name;
            this.title = title || name + ' Service';
            dependenciesMixin(this);
            testsMixin(this);
            return this;
        }
        ServiceTest.prototype.describe = function(test) {
            var self = this;
            describe(self.title, function() {
                beforeEach(function() {
                    createAngularService(self);
                });
                it('Should exist in module ' + self.moduleTest.name, function() {
                    self.moduleTest.$injector.has(self.name).should.be.true;
                });
                if (test) self.addTest(test)();
            });
            return this;
        }

        ServiceTest.prototype.getService = function() {
            var self = this;
            if (!self.moduleTest.$injector.has(self.name)) return;

            // create stub services within the current module
            _T.currentModule.module.config(function($provide) {
                $provide.provider('LoginSessionService', function() {
                    this.$get = function() {
                        return {
                            LoginSessionService: {
                                CurrentSession: function() {
                                    return 12;
                                }
                            }
                        };
                    };
                });
            });



            //self.stubNames.forEach(function (element) {
            //    self.stubs[element] = _T.currentModule.stubData[element];
            //    _T.currentModule.module.factory(element, function () { return self.stubs[element] });
            //});

            self.service = _T.$injector.get(self.name);
        }
        ServiceTest.prototype.describeCallHttp = function(options, test) {
            var self = this;
            describe(self.name + ' Http Post Method', function() {
                beforeEach(function() {
                    self.getService();
                    self.httpResponse = getHttpResponse(options.method.name, data.method.params);
                });
                //it('Should call the web api with a request payload', function () {
                //    response.config.data
                //            .should.be.eql(data.expected.request);
                //});
                it('Should return response payload', function() {
                    if (data.expected.response === null) {
                        expect(self.httpResponse).to.be.null;
                    } else {
                        response
                            .should.be.eql(data.expected.response);
                    }
                });
                if (angular.isFunction(test)) test();
            });
            return this;
        }
        ServiceTest.prototype.method = function(name, title) {
            this.methods[name] = new Method(name, title);
            return this.methods[name];
        }



        function createAngularService(self) {
            if (!self.moduleTest.$injector.has(self.name)) {
                throw new Texception('Cannot create service, it does not exist within the ' + module.name + ' module.');
            };
            // todo: add dependencies to module
            addDependencies(self.dependencies);
            self.angularService = self.moduleTest.$injector.get(self.name);
        }

        function addDependencies(hashMap) {
            angular.forEach(hashMap,function(element) {
                self.stubs[element] = _T.currentModule.stubData[element];
                _T.currentModule.module.factory(element, function() {
                    return self.stubs[element]
                });
            });
        }

        function getHttpResponse(method, params) {
            var response;
            _T.currentService[method](params)
                .then(function(data) {
                    response = data;
                });
            _T.$httpBackend.flush();
            return response;
        }

        function httpServiceMethod(data) {
            describe(data.method.name, function() {
                var response = null;
                beforeEach(function() {
                    response = getHttpResponse(data.method.name, data.method.params);
                });

                //it('Should call the web api with a request payload', function () {
                //    response.config.data
                //            .should.be.eql(data.expected.request);
                //});
                it('Should return response payload', function() {
                    if (data.expected.response === null) {
                        expect(response).to.be.null;
                    } else {
                        response
                            .should.be.eql(data.expected.response);
                    }
                });
            });
        }

        return ServiceTest;
    })();

    /**
     * An angular directive to test
     * @param {} name - the HTML tag name
     * @returns {} - the directive test object
     */
    var Directive = function(name) {
        base(this, name, name + ' Directive');
        this.attributes = {};
        this.html = null;
        this.element = null;
        this.scopeProperties = [];
        return this;
    }
    Directive.prototype.compile = function() {
        this.html = buildDomElement(this.name, this.attributes);
        if (!this.scope) this.getScope();
        this.getScopeProperties();
        this.element = compileToScope(this.html, this.scope);
        this.compiledHtml = this.element.outerHTML;
        return this;
    }
    Directive.prototype.withAttributes = function(attrs) {
        this.attributes = attrs;
        return this;
    }
    Directive.prototype.withScopeProperties = function(properties) {
        this.scopeProperties = properties;
        return this;
    }
    Directive.prototype.getScopeProperties = function() {
        var self = this;
        this.scopeProperties.forEach(function(property) {
            self.scope[property.name] = property.value;
        });
    }
    Directive.prototype.describe = function(test) {
        var self = this;
        describe(self.name + ' Directive', function() {
            beforeEach(function() {
                _T.currentDirective = self;
                self.getStubs();
            });
            test();
        });
        return this;
    }

    function buildDomElement(name, attrs) {
        var html = '<' + name + ' ';
        angular.forEach(attrs, function(attribute, key) {
            if (!attribute.include) return;
            html += key + '="' + attribute.value + '" ';
        });
        html += '></' + name + '>';
        return html;
    }

    function compileToScope(template, scope) {
        var compiledElement = _T.$compile('<div>' + template + '</div>')(scope);
        scope.$apply();
        return compiledElement[0].firstChild;
    }


    /*
     *  Phantom.js does not support Function.prototype.bind (at least not before v.2.0)
     *  That's just crazy. Everybody supports bind.
     *  Read about it here: https://groups.google.com/forum/#!msg/phantomjs/r0hPOmnCUpc/uxusqsl2LNoJ
     *  This bind polyfill is copied directly from MDN
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
     */
    (function() {
        if (Function.prototype.bind) {
            return;
        } // already defined

        /*jshint freeze: false */
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError(
                    'Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FuncNoOp = function() {},
                fBound = function() {
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
    (function(sinon) {
        sinon.stub.returnsPromise = function() {
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

    /**
     * Given a DOM element, get an array of child nodes of a given localName
     * @param {} element - a DOM element with child nodes
     * @param {} localName - the localName to find
     * @returns {} array - an array of DOM elements
     */
    function getChildNodesByLocalName(element, localName) {
        if (element === undefined ||
            element === null ||
            element.childNodes.length < 1) return new [];

        var els = element.childNodes,
            l = els.length,
            arr = [];
        for (var i = 0; i < l; i += 1)
            if (els[i].localName === localName)
                arr.push(els[i]);
        return arr;
    }

    /**
     * exception object
     * @param {} message - an exception message
     * @returns {} the _Texception object
     */
    function Texception(message) {
        this.name = '_Texception';
        this.message = message;
    }
    Texception.prototype = new Error();
    Texception.prototype.constructor = Texception;

    /** ACTIVATE THIS MODULE **/
    // place public methods on window
    window._T = publicApi;


})(angular, mocha, chai, sinon);