$app.controller('editTemplatesCtrl', editTemplatesCtrl);

editTemplatesCtrl.$inject = ['$scope', '$stateParams', '$location', 'notificationService', 'templatesService', 'itemsDataService'];

function editTemplatesCtrl($scope, $stateParams, $location, notificationService, templatesService, itemsDataService) {
  const vm = this;

  vm.data = {
    name: '',
    allItems: [],
    inList: [],
    items: [],
  };

  const recalculateItems = () => {
    vm.data = Object.assign({}, vm.data, {
      items: vm.data.allItems.filter(e => !vm.data.inList.includes(e)),
    });
  }

  this.addToList = (id) => {
    vm.data = Object.assign({}, vm.data, {
      inList: [...vm.data.inList, vm.data.items.reduce((acc, c) => +c.id === +id ? c : acc,  {})],
    });
    recalculateItems();
  }

  this.removeFromList = (id) => {
    vm.data = Object.assign({}, vm.data, {
      inList: vm.data.inList.filter(e => +e.id !== +id),
    });
    recalculateItems();
  }

  this.updateTemplate = (id) => {
    const { name, inList } = vm.data;
    const items = inList.map(e => e.id).join(',');
    templatesService.updateTemplate(id, name, items)
      .then(() => {
        $location.url('/home/templates');
      })
      .catch(err => console.log(err));
  }

  this.createTemplate = () => {
    const { name, inList } = vm.data;
    const items = inList.map(e => e.id).join(',');
    templatesService.createTemplate(name, items)
      .then(() => {
        $location.url('/home/templates');
      })
      .catch(err => console.log(err));
  }

  const fetchItems = () => itemsDataService.getAll();

  const fetchTemplate = (id) => templatesService.getTemplate(id);

  const init = () => {
    vm.isEdit = !!$stateParams.id;
    vm.id = vm.isEdit ? $stateParams.id : null;
    notificationService.loading.start();

    if (vm.isEdit) {
      Promise.all([fetchItems(), fetchTemplate(vm.id)])
        .then(res => {
          const template = res[1].data;
          const allItems = res[0].data;
          vm.data = Object.assign({}, vm.data, {
            name: template.name,
            inList: template.items
              ? template.items
                  .split(',')
                  .map(id => allItems[allItems.reduce((a, c, i) => +c.id === +id ? i : a, null)])
              : [],
            allItems,
          });
        })
        .then(recalculateItems)
        .then(() => { notificationService.loading.stop() })
        .then(() => { $scope.$apply(); })
        .catch(err => {
          console.log(err);
          notificationService.loading.stop();
        });
    } else {
      fetchItems()
        .then(({ data }) => {
          vm.data = Object.assign({}, vm.data, { allItems: data });
        })
        .then(recalculateItems)
        .then(notificationService.loading.stop)
        .catch(err => {
          console.log(err);
          notificationService.loading.stop();
        });
    }
  }
  init();
}
