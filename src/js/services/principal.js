angular.module('rezcaster').factory('principal', function ($q, $http, $state, $timeout, $localStorage, API) {
    var _identity = undefined,
        _authenticated = false;

    return {
        isIdentityResolved: function () {
            return angular.isDefined(_identity);
        },
        isAuthenticated: function () {
            return _authenticated;
        },
        isInRole: function (role) {
            if (!_authenticated || !_identity.roles) return false;

            return _identity.roles.indexOf(role) != -1;
        },
        isInAnyRole: function (roles) {
            if (!_authenticated || !_identity.roles) return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        },

        authenticate: function (identity) {
            _identity = identity;
            _authenticated = identity != null;
        },
        identity: function (force, next) {
            var deferred = $q.defer();

            if (force === true) _identity = undefined;

            // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity);

                return deferred.promise;
            }


            if (!$localStorage.token) {

                _identity = null;
                _authenticated = false;
                deferred.resolve(_identity);
            } else {
                // add user role to server response
                var data = {
                    token: $localStorage.token,
                    roles: 'user'
                };

                _identity = data;
                _authenticated = true;
                deferred.resolve(_identity);
            }


            return deferred.promise;
        }
    };
});
