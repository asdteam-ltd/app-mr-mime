angular.module('rezcaster').factory('httpInterceptor', [
    '$rootScope',
    '$localStorage',
    '$q',
    '$injector',
    function ($rootScope, $localStorage, $q, $injector) {
        'use strict';
        var interceptor = {

            requestError: function (rejection) {
                // do something on error
                return $q.reject(rejection);
            },
            response: function (response) {
                // do something on success
                return response;
            },
            responseError: function (rejection) {
                // do something on error
                if (rejection.status === 401) {
                    delete $localStorage.token;
                    var principal = $injector.get('principal');
                    var $state = $injector.get('$state');
                    principal.identity(true).then(function () {
                        $state.go('login');
                    });
                }
                //  notify.do('alert', rejection.error);
                return $q.reject(rejection);
            },
            request: function (req) {
                return $q.resolve(req);
            }
        };
        return interceptor;
    }]);
