function criticalItemC(itemsDataService, $scope, $localStorage) {
	const $ctrl = this;

	$ctrl.isRemoved = false;
	$ctrl.editing = false;

	$ctrl.newName = '';
	$ctrl.newDescription = '';

	$ctrl.critical = null;
	$ctrl.privateItem = null;

	$ctrl.toggleCritical = () => {
		$ctrl.critical = !$ctrl.critical;
	}

	$ctrl.togglePrivate = () => {
		$ctrl.privateItem = !$ctrl.privateItem;
	}

	$ctrl.editProduct = (id) => {
		$ctrl.critical = $ctrl.critical || $ctrl.data.critical;
		$ctrl.privateItem = $ctrl.privateItem || $ctrl.data.private;
		$ctrl.newName = $ctrl.newName || $ctrl.data.name;
		$ctrl.newDescription = $ctrl.newDescription || $ctrl.data.description;

		$ctrl.localCategories = $ctrl.localCategories || $ctrl.categories.map(category =>
			Object.assign({}, category, {
				items: category.items.map(el => el.id),
				active: category.items.map(el => el.id).includes(id)
			})
		);
		$ctrl.localMarkets = $ctrl.localMarkets || $ctrl.markets.map(market =>
			Object.assign({}, market, {
				items: market.items.map(el => el.id),
				active: market.items.map(el => el.id).includes(id)
			})
		);
		$ctrl.editing = true;
	}

	$ctrl.changeCategory = (id) => {
		$ctrl.localCategories = $ctrl.localCategories.map(category =>
			Object.assign({}, category, { active: category.id === id })
		);
	}

	$ctrl.changeMarket = (id) => {
		$ctrl.localMarkets = $ctrl.localMarkets.map(market =>
			Object.assign({}, market, { active: market.id === id })
		);
	}

	$ctrl.saveProduct = (id) => {
		$ctrl.loading = true;
		$ctrl.error = null;
		const {
			privateItem,
			critical,
			newName,
			newDescription,
			localCategories,
			localMarkets,
			data: { count, inBuyList }
		} = $ctrl;

		const data = {
			categories: localCategories.reduce((acc, el) => el.active ? el.id : acc, null),
			markets: localMarkets.reduce((acc, el) => el.active ? el.id : acc, null),
			description: newDescription,
			namme: newName,
			private: privateItem,
			count,
			inBuyList,
			critical
		}

		itemsDataService.editItem(data)
			.then(res => {
				console.log(res);
				$ctrl.editing = false;
				$ctrl.loading = false;
			})
			.catch(err => {
				$ctrl.error = 'Something wrong, try again :((';
				$ctrl.loading = false;
				console.warn(err);
			})
	}

	$ctrl.cancelEditing = () => {
		const { id } = $ctrl.data;
		$ctrl.loading = false;

		$ctrl.newName = $ctrl.data.name;
		$ctrl.newDescription = $ctrl.data.description;

		$ctrl.critical = $ctrl.data.critical;
		$ctrl.private = $ctrl.data.private;

		$ctrl.localCategories = $ctrl.categories.map(category =>
			Object.assign({}, category, {
				items: category.items.map(el => el.id),
				active: category.items.map(el => el.id).includes(id)
			})
		);
		$ctrl.localMarkets = $ctrl.markets.map(market =>
			Object.assign({}, market, {
				items: market.items.map(el => el.id),
				active: market.items.map(el => el.id).includes(id)
			})
		);

		$ctrl.editing = false;
	}

	$ctrl.changeStatus = (id, status) => {
		$ctrl.onChangeStatus(id, status);
	};

	$ctrl.deleteProduct = (id) => {
		$ctrl.onDeleteProduct(id);
	};

	$ctrl.addToBuyList = (id) => {
		$ctrl.onAddToBuyList(id);
	};

	$ctrl.removeFromBuyList = (id) => {
		$ctrl.onRemoveFromBuyList(id);
	};


	$scope.onSwipeLeft = ()=> {
		console.log($scope.swipeClose())
	}

	$scope.isAuth = ()=> $localStorage.pin;

	$scope.onSwipeRight = ()=> {
		$ctrl.isRemoved = true;
	}
}

// swipe swipe-left="onSwipeLeft" swipe-right="onSwipeRight" right-template="components/common/list-item/to-buy-list.html" left-template="components/common/list-item/removed.html"
$app.component('listItem', {
	template: `
		<div ng-if="!$ctrl.isRemoved">
			<div class="list-item" ng-class="{'critical': $ctrl.data.critical}">
				<div class="info">
					<h2>{{$ctrl.data.name}}</h2>
					<span class="last-updated" ng-if="$ctrl.data.critical">Оновлено: {{$ctrl.data.updatedAt | date : 'yyyy-MM-dd hh:mm'}}</span>
					<h4>{{$ctrl.data.description}}</h4>
					<div class="list-item-status-control">
						<button ng-click="$ctrl.changeStatus($ctrl.data.id, 'setAsOver')" class="crit-status-btn no" ng-class="{active: $ctrl.data.count === 'no'}">
							<i class="fa fa-battery-empty" aria-hidden="true"></i>
						</button>
						<button ng-click="$ctrl.changeStatus($ctrl.data.id, 'setAsFew')" class="crit-status-btn few" ng-class="{active: $ctrl.data.count === 'few'}">
							<i class="fa fa-battery-1" aria-hidden="true"></i>
						</button>
						<button ng-click="$ctrl.changeStatus($ctrl.data.id, 'setAsEnough')" class="crit-status-btn enough" ng-class="{active: $ctrl.data.count === 'enough'}">
							<i class="fa fa-battery-4" aria-hidden="true"></i>
						</button>
					</div>
				</div>
				<div class="list-item-controls" ng-if="isAuth()">
					<div class="col-center">
						<button
							class="edit"
							ng-if="!$ctrl.editing"
							ng-click="$ctrl.editProduct($ctrl.data.id)"
						>
							<i class="fa fa-pencil" aria-hidden="true"></i>
						</button>
						<button
							class="save"
							ng-if="$ctrl.editing && !$ctrl.loading"
							ng-click="$ctrl.saveProduct($ctrl.data.id)"
						>
							<i class="fa fa-floppy-o" aria-hidden="true"></i>
						</button>
						<div class="loading" ng-if="$ctrl.loading">
							<div class="pointer"></div>
						</div>
					</div>
					<div class="col">
						<a href="javascript:void(0);" class="remove"  ng-click="$ctrl.deleteProduct($ctrl.data.id)">
							<i class="fa fa-trash-o" aria-hidden="true"></i>
						</a>
						<a href="javascript:void(0);" class="to-buy-list" ng-if="!$ctrl.data.inBuyList" ng-click="$ctrl.addToBuyList($ctrl.data.id)">
							<i class="fa fa-cart-plus" aria-hidden="true"></i>
						</a>
						<a href="javascript:void(0);" class="from-buy-list" ng-if="$ctrl.data.inBuyList" ng-click="$ctrl.removeFromBuyList($ctrl.data.id)">
							<i class="fa fa-cart-plus" aria-hidden="true"></i>
						</a>
					</div>
				</div>
			</div>
			<div class="wrapEditing" ng-if="$ctrl.editing">
				<h2>Name:</h2>
				<input ng-model="$ctrl.newName" type="text" placeholder="Enter new name" value="{{$ctrl.data.name}}" />
				<h2>Description:</h2>
				<input ng-model="$ctrl.newDescription" type="text" placeholder="Enter new description" value="{{$ctrl.data.description}}" />
				<h2>Category:</h2>
				<ul class="radio-list">
					<li
						ng-class="item.active && 'active'"
						ng-repeat="item in $ctrl.localCategories"
						ng-click="$ctrl.changeCategory(item.id)"
					>
						{{item.name}}
					</li>
				</ul>
				<h2>Markets:</h2>
				<ul class="radio-list">
					<li
						ng-class="item.active && 'active'"
						ng-repeat="item in $ctrl.localMarkets"
						ng-click="$ctrl.changeMarket(item.id)"
					>
						{{item.name}}
					</li>
				</ul>
				<h2>Critical:</h2>
				<div class="checkbox" ng-class="$ctrl.critical && 'active'" ng-click="$ctrl.toggleCritical()">
					<div class="pointer"></div>
				</div>
				<h2>Private:</h2>
				<div class="checkbox" ng-class="$ctrl.privateItem && 'active'" ng-click="$ctrl.togglePrivate()">
					<div class="pointer"></div>
				</div>
				<div class="pipe"></div>
				<button class="cancel" ng-click="$ctrl.cancelEditing()">cancel</button>
				<div class="error" ng-if="$ctrl.error">{{$ctrl.error}}</div>
			</div>
		</div>
	`,
	controller: criticalItemC,
	bindings: {
		markets: '<',
		categories: '<',
		data: '<',
		onChangeStatus: '<',
		onDeleteProduct: '<',
		onRemoveFromBuyList: '<',
		onAddToBuyList: '<'
	}
});
