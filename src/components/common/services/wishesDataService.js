$app.factory('wishesDataService', wishesDataService);

wishesDataService.$inject = ['API'];

function wishesDataService(API){
	const service = {
    'add': _add,
    'get': _get,
    'delete': _delete,
    'getList': _getList
  };
	return service;

  function _add(data){
    return API.post('wishes', {name: data.name});
  }

  function _get(id){
    return API.get('wishes/', {id: id});
  }

  function _delete(id){
    return API.delete('wishes', {id: id});
  }

  function _getList(){
    return API.get('wishes');
  }
}
