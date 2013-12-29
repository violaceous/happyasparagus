angular.module('happyasparagusApp').controller("HomeController", function($scope, $location, $http, AuthenticationService, UserService) {
    'use strict';
    $scope.credentials = { email: "", password: "" };
    var purchases;
    // $http.get("/api/purchases/" + $scope.id);

    alert(UserService.getId);
    var toPass = {
	id: '1'
    }
    $http.post("/api/purchases", toPass);

    var onHomeSuccess = function(data, status, headers, config) {
	FlashService.clear();
	movies = data.movies;
    };

    var onHomeError = function() {
	alert('home error!');
    };
    

    $scope.logout = function() {
	AuthenticationService.logout();
    };
    
});
