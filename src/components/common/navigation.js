function navigationCtrl($state, $localStorage) {
  const $ctrl = this;
  $ctrl.isAuth = ()=> $localStorage.pin;
  $ctrl.isDashboard = ()=>$state.$current.name === 'home.dashboard';
}

$app.component('navigation', {
  template: `
    <header class="navigation" ng-class="$ctrl.isDashboard() && $ctrl.isAuth() ? 'dashboard-nav' : ''">
      <a ui-sref="home.login" ng-if="$ctrl.isDashboard() && !$ctrl.isAuth()" class="back-btn">Вхід</a>
      <a ui-sref="home.dashboard" ng-if="!$ctrl.isDashboard()" class="back-btn">
        <i class="fa fa-chevron-left" aria-hidden="true"></i>
        <span>назад</span>
      </a>
      <div class="text-logo">mr. mime <small>beta</small></div>
    </header>
  `,
  controller: navigationCtrl,
  bindings: {

  }
});
