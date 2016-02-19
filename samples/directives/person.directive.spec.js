(function () {
    var
        person = {
            first: '75ae547b-f7ad-46d9-99c2-115266b85a01',
            last: 'f45b3494-57b1-4a6b-a1cd-b98731d2f977',
            age: sinon.stub()
        },
        onChange = sinon.stub(),
        attributes = [
            { key: 'ng-model', value: 'person' },
            { key: 'ng-change', value: 'onChange()'}
        ];

    _T.createModuleTest('s.person.directive')
        .describe(function () {
            var personModuleTest = this;

            personModuleTest.createDirectiveTest('person', attributes)
                .withTemplateUrl({
                    directivePath: '/samples/directives/person.html',
                    unitTestPath: '/samples/directives/person.html'
                })
                .withParentScope({
                    person: person,
                    onChange: onChange
                })
                .describe(function () {
                    var personDirectiveTest = this;
                    it('should have the person on the scope', function () {
                        personDirectiveTest.scope.ngModel.should.equal(person);
                    });
                });
        });


})();