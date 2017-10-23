function floatLink() {
  const $ctrl = this;

}

$app.component('floatLink', {
  template: `
    <a ng-class="$ctrl.scrollToEnd && 'unfixed'" ui-sref="$ctrl.link" class="float-link">
      <span ng-transclude></span>
    </a>
  `,
  controller: floatLink,
  transclude: true,
  bindings: {
    link: '<',
    scrollToEnd: '<'
  }
});
