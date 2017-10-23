$app.controller('itemsListCtrl', itemsListCtrl);

itemsListCtrl.$inject = ['$scope','itemsDataService', 'marketsDataService', 'categoriesDataService', '$q', 'notificationService', '$localStorage', 'API'];

function itemsListCtrl($scope, itemsDataService, marketsDataService, categoriesDataService, $q, notificationService, $localStorage, API) {
  const vm = this;

  vm.filter = {
    over: true,
    few: true,
    enough: true,
    critical: false,
    noMarket: true,
  };

  vm.scrollToEnd = false;
  vm.filtersCollapsed = false;

  vm.toggleFilters = () => {
    const { filtersCollapsed } = vm;
    vm.filtersCollapsed = !filtersCollapsed;
  }

  const scroll = (e) => {
    const fullHeight = document.body.offsetHeight;
    const scroll = window.pageYOffset;
    const height = window.innerHeight;
    vm.scrollToEnd = fullHeight - (scroll + height) < 40;
    $scope.$apply();
  };

  vm.$onInit = () => {
    window.addEventListener('scroll', scroll);
  };

  $scope.$on('$destroy', () => {
    window.removeEventListener('scroll', scroll);
  });

  vm.notify = function(){
    API.get('notify/')
      .then(function(res){
        console.log(res)
      })
  }

  let itemsStore = null;

  function fetchItems(){
    notificationService.loading.start();
    $q.all([
      marketsDataService.getList(),
      categoriesDataService.getList()
    ])
    .then(([markets, categories]) => {
        notificationService.loading.stop();
        vm.items = [];
        vm.filter.marketsList = markets.data.map(market => Object.assign({}, market, { selected: true }));
        vm.filter.categoriesList = categories.data.map(category => Object.assign({}, category, { selected: true }));

        var marketItems = vm.filter.marketsList.reduce((acc, el) => el.selected ? [...acc, ...el.items] : [...acc], []);
        var categoriesItems = vm.filter.categoriesList.reduce((acc, el) => el.selected ? [...acc, ...el.items] : [...acc], []);

        vm.items = marketItems.reduce((acc, el) =>
          categoriesItems
            .filter(category => category.id === el.id)
            .length
              ? [...acc, el]
              : [...acc]
        , []);

    })
  }

  fetchItems();


  $scope.$watch(() => this.filter, (n,o) => {

    if(!vm.filter.marketsList) return;

    vm.items = [];

    var marketItems = vm.filter.marketsList.reduce((acc, el) => el.selected ? [...acc, ...el.items] : [...acc], []);
    var categoriesItems = vm.filter.categoriesList.reduce((acc, el) => el.selected ? [...acc, ...el.items] : [...acc], []);

    vm.items = marketItems.reduce((acc, el)=> {
      return categoriesItems.filter(_=>_.id === el.id).length
              ? [...acc, el]
              : [...acc]
    }, []);

    vm.items = vm.items.filter(_=> {
      if(vm.filter.over && _.count === 'no') return true;
      if(vm.filter.few && _.count === 'few') return true;
      if(vm.filter.enough && _.count === 'enough') return true;
    });

    if(!$localStorage.pin) {
      vm.items = vm.items.filter(_=> !_.private)
    }

    if(!vm.filter.critical) return;
    vm.items = vm.items.filter(_=> {
        if(vm.filter.critical && _.critical === true) return true;
    })

  }, true);

  vm.selectAllStatus = () => {
    const { filter } = vm;
    vm.filter = Object.assign({}, filter, {
      over: true,
      few: true,
      enough: true,
    });
  };

  vm.clearAllStatus = () => {
    const { filter } = vm;
    vm.filter = Object.assign({}, filter, {
      over: false,
      few: false,
      enough: false,
    });
  };

  vm.selectAllMarkets = () => {
    const { filter: { marketsList } } = vm;
    vm.filter.marketsList = marketsList.map(market =>
      Object.assign({}, market, { selected: true })
    );
  };

  vm.clearSelectedMarkets = () => {
    const { filter: { marketsList } } = vm;
    vm.filter.marketsList = marketsList.map(market =>
      Object.assign({}, market, { selected: false })
    );
  };

  vm.selectAllCategories = () => {
    const { filter: { categoriesList } } = vm;
    vm.filter.categoriesList = categoriesList.map(market =>
      Object.assign({}, market, { selected: true })
    );
  };

  vm.clearSelectedCategories = () => {
    const { filter: { categoriesList } } = vm;
    vm.filter.categoriesList = categoriesList.map(market =>
      Object.assign({}, market, { selected: false })
    );
  };


  vm.onChangeItemStatus = (id, status) => {
    itemsDataService[status](id)
      .then(response => {
        fetchItems();
      })
  }

  vm.onDeleteProduct = (id) => {
    itemsDataService.delete(id).then(() => {
      fetchItems();
    });
  }

  vm.onAddToBuyList = (id) => {
    itemsDataService.addToBuyList(id).then(() => {
      fetchItems();
    });
  }

  vm.onRemoveFromBuyList = (id) => {
    itemsDataService.removeFromBuyList(id).then(() => {
      fetchItems();
    });
  }

}
