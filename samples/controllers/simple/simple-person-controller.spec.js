(function() {
    var
        personData = '570f528c-1e3d-48cd-b8c4-0dca27f91159',
        controller;
    
    _T.createModule('app.people')
            .describe(function() {
                this.addController('personController')
                    .controllerAs('vm')
                    .inject({
                        'personData': personData
                    })
                    .describe(function () {
                        controller = this;
                        it('Should contain the person data', function() {
                            controller.scope.vm.person
                                .should.be.equal(personData);
                        });
                    });
            });
})();