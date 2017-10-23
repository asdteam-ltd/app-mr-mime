function editTemplateCtrl() {
  const $ctrl = this;
  $ctrl.$onInit = () => {
    // console.log($ctrl);
  }
}

$app.component('editTemplate', {
  template: `
    <div class="edit-template">
      <div class="top">
        <div class="buttons">
          <a class="btn-save" ng-if="!$ctrl.type" ng-click="$ctrl.createTemplate()">create</a>
          <a class="btn-save" ng-if="$ctrl.type" ng-click="$ctrl.updateTemplate($ctrl.templateId)">save</a>

          <a class="btn-delete" ui-sref="home.templates">cancel</a>
        </div>
        <input type="text" name="name" ng-model="$ctrl.data.name" placeholder="Enter the name of template">
      </div>

      <h2 class="pipe">In List:</h2>
      <div class="wrap-list">
        <div class="no-items" ng-if="!$ctrl.data.inList.length">No items in the list</div>
        <div class="item list-item" ng-repeat="item in $ctrl.data.inList" id="{{item.id}}">
          <div className="content">
            <h2>{{item.name}}</h2>
            <p>{{item.description}}</p>
          </div>
          <span ng-click="$ctrl.removeFromList(item.id)"><i class="fa fa-minus" aria-hidden="true"></i></span>
        </div>
      </div>
      <h2 class="pipe">All goods:</h2>
      <div class="wrap-list">
        <div class="no-items" ng-if="!$ctrl.data.items.length">No items in the list</div>
        <div class="item list-item" ng-repeat="item in $ctrl.data.items" id="{{item.id}}">
          <div className="content">
            <h2>{{item.name}}</h2>
            <p>{{item.description}}</p>
          </div>
          <span ng-click="$ctrl.addToList(item.id)"><i class="fa fa-plus" aria-hidden="true"></i></span>
        </div>
      </div>
    </div>
  `,
  controller: editTemplateCtrl,
  bindings: {
    type: '<',
    templateId: '<',
    data: '<',
    removeFromList: '<',
    addToList: '<',
    createTemplate: '<',
    updateTemplate: '<'
  }
});
