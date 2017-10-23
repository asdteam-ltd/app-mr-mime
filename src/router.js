function router($stateProvider, $urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/home/dashboard');
    $stateProvider
        .state('home.login', {
            url: '/login',
            templateUrl: 'components/login/login.html',
            controller: 'loginCtrl',
            controllerAs: 'LOGIN'

        })
        .state('home', {
            url: '/home',
            templateUrl: 'components/common/common.html',
            abstract: true
            // resolve: {
            //     authorize: ['authorization',
            //         function (authorization) {
            //             return authorization.authorize();
            //
            //         }
            //     ]
            // }
        })
        .state('home.dashboard', {
            url: '/dashboard',
            templateUrl: 'components/dashboard/dashboard.html',
            controller: 'dashboardCtrl'

        })
        .state('home.items-list', {
            url: '/items',
            templateUrl: 'components/items-list/items-list.html',
            controller: 'itemsListCtrl',
            controllerAs: 'ITEMS_LIST'

        })
        .state('home.add-item', {
            url: '/add/:id?',
            templateUrl: 'components/add-item/add-item.html',
            controller: 'addItemCtrl',
            controllerAs: 'ADD_ITEM'

        })
        .state('home.buy-list', {
            url: '/buy-list',
            templateUrl: 'components/buy-list/buy-list.html',
            controller: 'buyListCtrl',
            controllerAs: 'BUY_LIST'

        })
        .state('home.wishes', {
            url: '/wishes',
            templateUrl: 'components/wishes/wishes.html',
            controller: 'wishesCtrl',
            controllerAs: 'WISHES'

        })
        .state('home.over', {
            url: '/over',
            templateUrl: 'components/over/over.html',
            controller: 'overCtrl',
            controllerAs: 'OVER'

        })
        .state('home.set-criticals', {
            url: '/set-criticals',
            templateUrl: 'components/set-criticals/index.html',
            controller: 'setCriticalsCtrl',
            controllerAs: 'SET_CRIT'
        })
        .state('home.taxonomies', {
            url: '/taxonomies',
            templateUrl: 'components/taxonomies/taxonomies.html',
            controller: 'taxonomiesCtrl',
            controllerAs: 'TAXONOMIES'
        })
        .state('home.report', {
            url: '/report',
            templateUrl: 'components/report/report.html',
            controller: 'reportCtrl',
            controllerAs: 'REPORT'
        })
        .state('home.templates', {
            url: '/templates',
            templateUrl: 'components/templates/templates.html',
            controller: 'templatesCtrl',
            controllerAs: 'TEMPLATES'
        })
        .state('home.createTemplate', {
            url: '/create-template',
            templateUrl: 'components/templates/editTemplate.html',
            controller: 'editTemplatesCtrl',
            controllerAs: 'EDIT_TEMPLATES'
        })
        .state('home.editTemplate', {
            url: '/edit-template/:id',
            templateUrl: 'components/templates/editTemplate.html',
            controller: 'editTemplatesCtrl',
            controllerAs: 'EDIT_TEMPLATES'
        })
}


$app.config(router);
