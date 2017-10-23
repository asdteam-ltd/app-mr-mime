const apiService = ($http, $q) => {
	'use strict';
	const appUrl = `http://54.225.225.47:1337/`;

	const _wrapRequest = (data) => angular.toJson(data);

	const createLink = (link, paramsObject) => {
		let outLink = appUrl + link;
		let params = paramsObject;
		if (!params) {
			params = {};
		}

		let paramsArr = [];
		if (Object.keys(params).length >= 1) {
			for (var key in params)
				paramsArr.push(key + '=' + params[key]);

			outLink += '?' + paramsArr.join('&');
		}
		return outLink;
	}

	const _post = (link, data, params) => {
		const deferred = $q.defer();

		$http.post(createLink(link, params), _wrapRequest(data))
			.then(({ data }) => { deferred.resolve(data); })
			.catch((err) => { deferred.reject(err); });

		return deferred.promise;
	}

	const _put = (link, data, params) => {
		const deferred = $q.defer();

		$http.put(createLink(link, params), _wrapRequest(data))
			.then(({ data }) => { deferred.resolve(data); })
			.catch((res) => { deferred.reject(res); });

		return deferred.promise;
	}

	const _get = (link, params) => {
		const deferred = $q.defer();

		$http.get(createLink(link, params))
			.then(({ data }) => { deferred.resolve(data); })
			.catch((res) => { deferred.reject(res); });

		return deferred.promise;
	}

	const _delete = (link, params) => {
		const deferred = $q.defer();

		$http.delete(createLink(link, params))
			.then(({ data }) => { deferred.resolve(data); })
			.catch((res) => { deferred.reject(res); });

		return deferred.promise;
	}

	// post file service
	const _postFileService = (link, data, params) => {
		const deferred = $q.defer();
		return $http.post(createLink(link, params), data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		})
			.then((res) => { deferred.resolve(res); })
			.catch((res) => { deferred.reject(res); });
	}

	return {
		'post': _post,
		'put': _put,
		'delete': _delete,
		'get': _get
	};
}
$app.factory('API', apiService);
apiService.$inject = ['$http', '$q'];
