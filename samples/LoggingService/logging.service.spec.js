var
    message = '854b61fb-5ed1-4bfc-99e5-02e82ed982be',
    data = 'e19b6257-70a9-4ffb-9128-2b948135eb17',
    source = '40f51c9d-a654-4c1a-9a32-2b920068c3b7',
    toasterStub = {
        pop: sinon.stub()
    };

_T.createModuleTest('s.logging')
       // .injectModule('ngAnimate')
       // .injectModule('toaster')
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

                        it('Should call toast.pop with a message.', function () {
                            toasterStub.pop.should.have.been.called;
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

                        it('Should call toast.pop with a message.', function () {
                            toasterStub.pop.should.have.been.called;
                        });
                    });
                });
        });