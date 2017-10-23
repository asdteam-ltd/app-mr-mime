$app.controller('taxonomiesCtrl', taxonomiesCtrl);

taxonomiesCtrl.$inject = ['marketsDataService', 'categoriesDataService', 'notificationService', '$q'];

function taxonomiesCtrl(marketsDataService, categoriesDataService, notificationService, $q) {
    const vm = this;

    vm.state = {};
    vm.category = {
      id: 0,
      name: ''
    };
    vm.market = {
      id: 0,
      name: ''
    };
    vm.marketsList = null;
    vm.categoriesList = null;

    vm.loading = {
      categories: {},
      markets: {},
    }

    function init(){
      notificationService.loading.start();

      $q.all([
        marketsDataService.getList(),
        categoriesDataService.getList(),
      ])
        .then(([markets, cats]) => {
          vm.marketsList = markets.data.map(market =>
            Object.assign({}, market, { editing: false })
          );
          vm.categoriesList = cats.data.map(category =>
            Object.assign({}, category, { editing: false })
          );

          vm.markets = markets.data.reduce((acc, { id, name }) => Object.assign({}, acc, { [id]: name, }), {});
          vm.categories = cats.data.reduce((acc, { id, name }) => Object.assign({}, acc, { [id]: name, }), {});

          notificationService.loading.stop();
        });
    };


    vm.clearEntity = ( entity ) => {
      entity.id = 0;
      entity.name = '';
    };

    // Categories functionality
    vm.editCategory = (id) => {
      vm.categoriesList = vm.categoriesList.map(category =>
        (category.id === id)
          ? Object.assign({}, category, { editing: true })
          : category
      );
    };

    vm.cancelCategoryEditing = (id) => {
      vm.categoriesList = vm.categoriesList.map(category =>
        (category.id === id)
          ? Object.assign({}, category, { editing: false })
          : category
      );

      // Set previous name if cancel editing
      vm.categories[id] = vm.categoriesList.reduce((acc, category) => category.id === id ? category.name : acc, '');
    }

    vm.saveCategoryEditing = (id) => {
      vm.loading.categories[id] = true;
      const newData = vm.categoriesList.reduce((acc, category) =>
        (category.id === id)
          ? Object.assign({}, category, { name: vm.categories[id] })
          : acc
      , null);

      categoriesDataService.update(newData)
        .then(({ data: { id, name } }) => {
          vm.loading.categories[id] = false;
          vm.categoriesList = vm.categoriesList.map(category =>
            (category.id === id)
              ? Object.assign({}, category, { name, editing: false })
              : category
          );
        })
        .catch(err => {
          vm.loading.categories[id] = false;
        });
    }

    vm.addCategory = (data) => {
      categoriesDataService.add(data)
        .then((data) => {
          vm.clearEntity(vm.category);
          init();
        });
    };

    vm.deleteCategory = (id) => {
      categoriesDataService.delete(id)
        .then(() => {
          init();
        });
    };

    // Markets
    vm.editMarket = (id) => {
      vm.marketsList = vm.marketsList.map(market =>
        (market.id === id)
          ? Object.assign({}, market, { editing: true })
          : market
      );
    };

    vm.cancelMarketEditing = (id) => {
      vm.marketsList = vm.marketsList.map(market =>
        (market.id === id)
          ? Object.assign({}, market, { editing: false })
          : market
      );

      // Set previous name if cancel editing
      vm.markets[id] = vm.marketsList.reduce((acc, market) => market.id === id ? market.name : acc, '');
    }

    vm.saveMarketEditing = (id) => {
      vm.loading.markets[id] = true;
      const newData = vm.marketsList.reduce((acc, market) =>
        (market.id === id)
          ? Object.assign({}, market, { name: vm.markets[id] })
          : acc
      , null);

      marketsDataService.update(newData)
        .then(({ data: { id, name } }) => {
          vm.loading.markets[id] = false;
          vm.marketsList = vm.marketsList.map(market =>
            (market.id === id)
              ? Object.assign({}, market, { name, editing: false })
              : market
          );
        })
        .catch(err => {
          vm.loading.markets[id] = false;
        });
    }

    vm.addMarket = (data) => {
      marketsDataService.add(data)
        .then((data)=>{
          vm.clearEntity(vm.market);
          init();
        });
    };

    vm.deleteMarket = (id) => {
      marketsDataService.delete(id)
        .then(() => {
          init();
        });
    };

    init();
}
