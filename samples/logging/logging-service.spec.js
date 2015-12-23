_T.addModule(LOGGING_MODULE_NAME)
.describe(function () {
    var expected;
    beforeEach(function () {
        expected = _T.expected(LOGGING_MODULE_NAME);
    });

    this.addService('loggingService')
        .describe(function () {
            var logger,
                service = this;

            beforeEach(function () {
                logger = service.angularService.logger(expected.source);
            });

            describe('The debug method', function () {
                beforeEach(function () {
                    logger.debug(expected.message, expected.data);
                });

                it('Should call $log.debug with a message.', function () {
                    var expectedLog = {
                        message: expected.message,
                        data: expected.data,
                        source: expected.source
                    };
                    service.module.$log.debug.logs.length.should.be.equal(1);
                    service.module.$log.debug.logs[0][0].should.eql(expectedLog);
                });
            });

            describe('The error method', function () {
                beforeEach(function () {
                    logger.error(expected.message, expected.data);
                });

                it('Should call $log.error with a message.', function () {
                    var expectedLog = {
                        message: expected.message,
                        data: expected.data,
                        source: expected.source
                    };
                    service.module.$log.error.logs.length.should.be.equal(1);
                    service.module.$log.error.logs[0][0].should.eql(expectedLog);
                });
            });
        });
});
