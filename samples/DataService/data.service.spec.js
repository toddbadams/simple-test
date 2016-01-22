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