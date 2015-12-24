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
    factory,
    result;

_T.createModule('app.people.person')
        .describe(function () {
            this.addFactory('personDataService')
                .backend('/api/person', personPromise)
                .method('get', [personId], result)
                .describe(function () {
                    factory = this;
                    it('Should get the person data', function () {
                        result.should.be.equal(personData);
                    });
                });
        });