'use strict';

angular.module('baseprojectApp')
	.controller("RegisterController", function($scope, $location, RegisterService) {
		$scope.user = { first: "", last: "", email: "", password: "" };

		$scope.register = function() {
			RegisterService.register($scope.user).success(function() {
				$location.path('/login');
			});
		};
	});
