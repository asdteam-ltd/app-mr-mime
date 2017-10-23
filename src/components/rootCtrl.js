angular.module('rezcaster').controller('rootCtrl', [
	'$rootScope',
	'$scope',
	'$timeout',
	'$localStorage',
	'$state',
	'$window',
	'API',
	'principal',
	'authService',
	function ($rootScope, $scope, $timeout, $localStorage, $state, $window, API, principal, authService) {

		'use strict';

		$scope.logout = function () {
			API.get('/authc/logout').success(function () {

				principal.identity(true).then(function () {
					$state.go('login');
				});

			});
		};

		$scope.regexp = {
			email: /^[aA-zZ0-9._%+-]+@[aA-zZ0-9.-]+\.[aA-zZ]{2,}/i
		};

		$rootScope.dateFormat = 'YYYY-MM-DD';

		$rootScope.isAuth = ()=> $localStorage.pin;



	}]);
