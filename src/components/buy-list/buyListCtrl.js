$app.controller('buyListCtrl', buyListCtrl);

buyListCtrl.$inject = ['$scope', 'itemsDataService', 'templatesService', 'notificationService'];

function buyListCtrl($scope, itemsDataService, templatesService, notificationService) {
  const vm = this;
  vm.allItems = [];
  vm.items = [];
  vm.templates = [];
  vm.emptyFields = false;
  vm.total = '';

  vm.dropdown = false;

  vm.activeDropdown = 'cart';

  this.toggleDropdown = () => {
    vm.dropdown = !vm.dropdown;
  };

  this.setActiveTemplate = (id, f) => {
    vm.activeDropdown = (id === 'cart')
      ? 'cart'
      : vm.templates.reduce((a, c) => +c.id === +id ? c : a, null);

    const templateItems = (id !== 'cart') &&
      vm.templates
        .reduce((a, c) => +c.id === +id ? c.items : a, {})
        .split(',')
        .map(e => parseInt(e));

    vm.items = (id === 'cart')
      ? vm.allItems.filter(item => item.inBuyList)
      : vm.allItems.filter(item => templateItems.includes(item.id));

    if (!f) this.toggleDropdown();
  };

  const fetchItems = () => itemsDataService.getAll();
  const fetchTemplates = () => templatesService.getTemplates();

  const fetchAllData = () => {
    notificationService.loading.start();
    Promise.all([fetchItems(), fetchTemplates()])
      .then(res => {
        const items = res[0].data;
        vm.allItems = items.map(item => Object.assign({}, item, { checked: false }));
        vm.items = items.filter(item => item.inBuyList);

        const templates = res[1].data;
        vm.templates = templates;
      })
      .then(() => this.setActiveTemplate('cart', true))
      .then(() => {
        notificationService.loading.stop();
        $scope.$apply();
      })
      .catch(err => {
        notificationService.loading.stop();
        console.log(err);
      })
  }

  vm.cart = [];

  vm.toggleItem = (id) => {
    if (vm.emptyFields) {
      vm.emptyFields = false;
    }
    const cartIncludesId = vm.cart.includes(id);
    if (cartIncludesId) {
      vm.cart = vm.cart.filter(_id => id !== _id);
    } else {
      vm.cart = [...vm.cart, id];
    }
  };

  vm.onBought = (total) => {
    if (total && vm.cart.length) {
      vm.total = '';
      vm.emptyFields = false;
      notificationService.loading.start();

      itemsDataService.purchase(vm.cart.join(','), total)
      .then(fetchAllData)
      .then(notificationService.loading.stop);
    } else {
      vm.emptyFields = true;
    }
  };

  fetchAllData();
};
