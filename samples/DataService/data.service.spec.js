var
    id = 1,
    first = '854b61fb-5ed1-4bfc-99e5-02e82ed982be',
    last = 'e19b6257-70a9-4ffb-9128-2b948135eb17',
    dob = '1990-08-24';

_T.createModuleTest('s.data')
        .describe(function () {
            var dataModule = this;
            this.createServiceTest('dataService')
                .describe(function () {
                    var dataServiceTest = this,
                        result;

                    describe('createPerson', function () {
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

                    describe('getPerson', function () {
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


                    describe('updatePerson', function () {
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