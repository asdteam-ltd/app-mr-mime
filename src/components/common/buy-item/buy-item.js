function buyItemC(){
  const $ctrl = this;

  console.log($ctrl);
}

$app.component('buyItem', {
  template: `
    <div class="list-item" ng-class="{checked: checked, cart: $ctrl.cart}">
      <div className="content">
        <h2 ng-if="$ctrl.data.name">{{$ctrl.data.name}}</h2>
        <h4 ng-if="$ctrl.data.description">{{$ctrl.data.description}}</h4>
      </div>
      <input
        id="{{$ctrl.data.id}}"
        type="checkbox"
        ng-model="checked"
        ng-change="$ctrl.toggleItem($ctrl.data.id)"
      />
      <label for="{{$ctrl.data.id}}" ng-class="{checked: checked}"></label>
    </div>
  `,
  controller: buyItemC,
  bindings: {
    data: '<',
    onBought: '<',
    toggleItem: '<',
    cart: '<'
  }
});
