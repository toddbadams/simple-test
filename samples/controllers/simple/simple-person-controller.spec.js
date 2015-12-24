(function () {
    var
        personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
        controller;

    _T.createModule('app.people.person')
            .describe(function () {
                this.addController('personController')
                    .controllerAs('vm')
                    .inject({
                        'personData': personData
                    })
                    .describe(function () {
                        controller = this;
                        it('Should contain the person data', function () {
                            controller.scope.vm.person
                                .should.be.equal(personData);
                        });
                    });
            });
})();


var
    personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
    personId = 1,
    personPromise = sinon.stub().returnsPromise().resolves(personData),
    method;

_T.createModule('app.people.person')
        .describe(function () {
            this.createFactory('personDataService')
                .describe(function () {
                    this.createMethod('get', [personId])
                        .backend('/api/person', personPromise)
                        .describe(function () {
                            method = this;
                            it('Should get the person data', function () {
                                method.result.should.be.equal(personData);
                            });
                        });
                });
        });