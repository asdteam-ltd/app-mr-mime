$app.controller('loginCtrl', loginCtrl);

loginCtrl.$inject = ['$localStorage', '$state', 'authService'];


function loginCtrl($localStorage, $state, authService) {
    const vm = this;

    vm.wrongPin = false;
    vm.resetMessage = false;

  		vm.login = pin => {
  			authService.auth(pin)
  				.then(res => {
  					if(res.data.ok) {
              $localStorage.pin = pin;
              $state.go('home.dashboard');
              vm.resetMessage = false;
              return;
            }

            vm.wrongPin = true;
  				})
  		};


      vm.resetPin = ()=> {
        vm.resetMessage = true;
        authService.resetPin()};
}
