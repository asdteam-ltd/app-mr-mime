angular.module('rezcaster').filter('tolowercase', [function () {


	return function (input) {

		return input.toLowerCase();
	};

}]);