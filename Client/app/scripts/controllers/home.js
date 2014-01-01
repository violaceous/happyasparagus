angular.module('happyasparagusApp').controller("HomeController", function($scope, $location, $http, AuthenticationService, UserService, autoComplete) {
    'use strict';
    $scope.credentials = { email: "", password: ""};

    $scope.names = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie", "celine", "brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred", "gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];

    var toPass= new Object();
    toPass.userid = UserService.getId();
    $http.post("/api/purchases", toPass);

    var onHomeSuccess = function(data, status, headers, config) {
	FlashService.clear();
	movies = data.movies;
    };

    var onHomeError = function() {
	alert('home error!');
    };
    
    $scope.update = function(newpurchase) {
	var toPass= new Object();
	toPass.userid = UserService.getId();	
	toPass.purchase = angular.copy(newpurchase);
	$http.post("/api/purchase", toPass);
    };

    $scope.logout = function() {
	AuthenticationService.logout();
    };
    
});
