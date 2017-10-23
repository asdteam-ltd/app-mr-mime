$app.controller('wishesCtrl', wishesCtrl);

wishesCtrl.$inject = ['wishesDataService', 'notificationService'];

function wishesCtrl(wishesDataService, notificationService) {
    const vm = this;
    vm.text = '';
    vm.list = [];

    function init(){
      notificationService.loading.start();
        const wishes = wishesDataService.getList()
          .then( (response) => {
            vm.list = response.data;
            notificationService.loading.stop();
        });
    }

    vm.add = () => {
        wishesDataService.add({name: vm.text}).then(()=>{
            vm.text = '';
            init();
        });
    };

    vm.delete = ( id ) => {
        wishesDataService.delete(id).then( () => {
            init();
        });
    };

    init();
}
