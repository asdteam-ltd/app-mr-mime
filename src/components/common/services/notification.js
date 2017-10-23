$app.factory('notificationService', notificationService);

notificationService.$inject = ['$rootScope'];

function notificationService($rootScope){
	return {
    loading: {
			start: loadingStart,
			stop: loadingStop,
		}
	};

	function loadingStart(){
		$rootScope.loading = true;
	}

	function loadingStop(){
		$rootScope.loading = false;
	}
}
