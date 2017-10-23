angular.module('rezcaster').factory('authorization', ['$rootScope', '$state', 'principal', '$stateParams', '$localStorage',
	function ($rootScope, $state, principal, $stateParams,$localStorage) {
		return {
			authorize: function () {
				return principal.identity()
					.then(function () {
							var isAuthenticated = principal.isAuthenticated();
							console.log($rootScope)
							if ($rootScope.toState.name === 'login' || $rootScope.toState.name === 'registration' || $rootScope.toState.name === 'forgot_password' || $rootScope.toState.name === 'reset_password') {
								return;
							}

							if (isAuthenticated) {
								//console.log('auth');
								return;
							}

							$state.go('login');
						}
					)
					;
			},
// localhost:3000/#/login?currency=USD&name=Test%20Manager%20ABvCL96rW6&organizationId=10&partyId=61580796&token=1d3bcf07-efa5-437a-8661-eebbcb07283a&redirectUrl=https:%2F%2Falfa.mybookingpal.com%2Fadmin%2Froot%2Fproperty-managers%2F
			preventLogin: function () {
				return principal.identity()
					.then(function () {
						var isAuthenticated = principal.isAuthenticated();

						if (isAuthenticated){
							$state.go('home.dashboard');
						}

					});
			}
		};
	}
]);
