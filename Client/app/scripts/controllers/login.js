angular.module('baseprojectApp').controller("LoginController", function($scope, $location, AuthenticationService) {
		'use strict';
		$scope.credentials = { email: "", password: "" };
		$scope.id = "";
		$scope.test = "test";
  
		$scope.goToRegister = function() {
			$location.path('/register');
		};

		$scope.login = function() {
			AuthenticationService.login($scope.credentials).success(function(data, $scope) {
				$scope.id = data.id;
				$location.path('/home');
			});
			 
		};
	});
