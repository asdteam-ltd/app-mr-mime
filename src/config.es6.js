$app.run(function ($rootScope, $stateParams,$state) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;

	$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
			$rootScope.toState = toState;
			$rootScope.toStateParams = toStateParams;

			if (principal.isIdentityResolved()) {
				authorization.authorize();
			}
		});
});


$app.config(function ($httpProvider) {
	'use strict';

	$httpProvider.interceptors.push('httpInterceptor');
	$httpProvider.defaults.timeout = 3000;

});
