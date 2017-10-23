$app.controller('templatesCtrl', templatesCtrl);

templatesCtrl.$inject = ['notificationService', 'templatesService'];

function templatesCtrl(notificationService, templatesService) {
  const vm = this;

  vm.templates = [];

  this.deleteTemplate = (id) => {
    templatesService.deleteTemplate(id)
      .then(() => {
        init();
      })
      .catch(err => console.log(err));
  }

  const init = () => {
    notificationService.loading.start();
    templatesService.getTemplates()
      .then(({ data }) => {
        vm.templates = data;
        notificationService.loading.stop();
      })
      .catch(err => {
        console.log(err);
        notificationService.loading.stop();
      });
  }
  init();
}
