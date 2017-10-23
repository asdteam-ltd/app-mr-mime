$app.controller('addItemCtrl', addItemCtrl);

addItemCtrl.$inject = ['$state', 'itemsDataService', 'wishesDataService', 'categoriesDataService', 'marketsDataService'];

function addItemCtrl($state, itemsDataService, wishesDataService, categoriesDataService, marketsDataService) {
  const vm = this;
  const wishId = $state.params.id;

  console.log('wishId', wishId);

  vm.categories = [];
  vm.markets = [];

  function init(){
    categoriesDataService.getList().then( ( data ) => {
      vm.categories = data.data;
      vm.state.category = vm.categories[0].id;
    });
    marketsDataService.getList().then( ( data ) => {
      vm.markets = data.data;
      vm.state.market = vm.markets[0].id;
    });

    if ( wishId ){
      wishesDataService.get(wishId).then( (data) => {
        vm.state.name = data.data.name || '';
      });
    }
  };

  vm.state = {
    name: '',
    description: '',
    category: null,
    market: null,
    critical: false,
    count: 0,
    private: false
  };

  vm.add = () => {
    console.log(vm.state)
    itemsDataService.add(vm.state).then((data)=>{
      $state.go('home.items-list');
      if (wishId){
        wishesDataService.delete(wishId).then(()=>{
          $state.go('home.add-item', {id: ''}, {reload: true});
        });
      }
    })
    .catch( (error) => {
      alert('Shit happens while add new product');
    });
  };

  init();
}
