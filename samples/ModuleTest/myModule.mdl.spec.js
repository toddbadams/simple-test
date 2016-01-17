_T.createModuleTest('myModule')
    .describe(function() {
        var myModuleTest = this;
        it('mySpecialObject should have id of 123', function(){
            var result = myModuleTest.$injector.get('mySpecialObject');
            result.id.should.equal(123);
        })
        it('myConstant should have value of 456', function(){
            var result = myModuleTest.$injector.get('myConstant');
            result.should.equal(456);
        })
    });