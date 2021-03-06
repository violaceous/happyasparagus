angular.module('happyasparagusApp').controller("LoginController", function($scope, $location, AuthenticationService, UserService) {
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
			    UserService.setId(data.id);
				$location.path('/home');
			});
			 
		};
	});
