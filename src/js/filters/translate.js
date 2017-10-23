angular.module('rezcaster').filter('translate', ['translateService', function (translateService) {


	return function () {
		if (!arguments) {
			return 'undefined';
		}
		return translateService.translate.apply(null, arguments);
	};

}]);