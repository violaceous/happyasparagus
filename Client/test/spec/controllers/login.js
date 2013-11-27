describe('LoginController', function(){
	'use strict';
    var scope, $httpBackend;//we'll use these in our tests
 
    //mock Application to allow us to inject our own dependencies
    beforeEach(module('wilardApp'));
    
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(inject(function($rootScope, $controller, _$httpBackend_){
        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', 'Users/users.json').respond([{id: 1, name: 'Bob'}, {id:2, name: 'Jane'}]);
 
        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        $controller('LoginController', {$scope: scope});
    }));
    // tests start here

    it('should have a blank id', function(){
        expect(scope.test).toBe('test');
    });
    
    /*
    it('should fetch list of users', function(){
        $httpBackend.flush();
        expect(scope.users.length).toBe(2);
        expect(scope.users[0].name).toBe('Bob');
    });
    */
});
