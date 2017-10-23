angular.module('rezcaster').filter('translate', ['translateService', (translateService) => () =>
		!arguments
			? 'undefined'
			: translateService.translate.apply(null, arguments)
]);
