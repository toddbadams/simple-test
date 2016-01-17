    var LOGGING_MODULE_NAME = 's.logging',
        LOGGING_SERVICE_NAME = 'loggingService',
        LOGGING_DEBUG_ENABLED_CONSTANT = 'loggingDebugEnabled';

    //      test data
    var message = '854b61fb-5ed1-4bfc-99e5-02e82ed982be',
        data = 'e19b6257-70a9-4ffb-9128-2b948135eb17',
        source = '40f51c9d-a654-4c1a-9a32-2b920068c3b7';

    _T.createModuleTest(LOGGING_MODULE_NAME)
        .describe(function() {
            var loggingModule = this;

            this.createServiceTest(LOGGING_DEBUG_ENABLED_CONSTANT, 'loggingDebugEnabled Constant')
                .describe(function() {
                    var loggingDebugEnabledTest = this;
                    it('Should be true.', function() {
                        loggingDebugEnabledTest.angularService.should.true;
                    });
                });

            this.createServiceTest(LOGGING_SERVICE_NAME)
                .describe(function() {
                    var logger,
                        loggingService = this;

                    beforeEach(function() {
                        logger = loggingService.angularService.logger(source);
                    });

                    describe('The debug method', function() {
                        beforeEach(function() {
                            logger.debug(message, data);
                        });

                        it('Should call $log.debug with a message.', function() {
                            loggingModule.$log.debug.logs.length.should.be.equal(1);
                            loggingModule.$log.debug.logs[0][0].should.eql({
                                message: message,
                                data: data,
                                source: source
                            });
                        });
                    });

                    describe('The error method', function() {
                        beforeEach(function() {
                            logger.error(message, data);
                        });

                        it('Should call $log.error with a message.', function() {
                            loggingModule.$log.error.logs.length.should.be.equal(1);
                            loggingModule.$log.error.logs[0][0].should.eql({
                                message: message,
                                data: data,
                                source: source
                            });
                        });
                    });
                });
        });