angular.module('wilardApp').controller("HomeController", function($scope, $location, $http, AuthenticationService) {
	'use strict';
		$scope.credentials = { email: "", password: "" };
		var movies;
	//	$http.get("/api/recommendations/" + $scope.id);
	
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
