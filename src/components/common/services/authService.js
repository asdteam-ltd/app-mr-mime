$app.factory('authService', authService);

authService.$inject = ['API'];

function authService(API){
	return {
    auth: auth,
		resetPin: resetPin
	};

	function auth(pin){
		return API.get(`auth/${pin}`)
	}

	function resetPin(){
		return API.put(`reset/`)
	}
}
