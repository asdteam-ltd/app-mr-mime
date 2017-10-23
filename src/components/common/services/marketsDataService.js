$app.factory('marketsDataService', marketsDataService);

marketsDataService.$inject = ['API'];

function marketsDataService(API){
    const service = {
        add: _add,
        delete: _delete,
        get: _get,
        update: _update,
        getList: getList
    };
    return service;

    function _add(data){
      return API.post('markets', {name: data.name});
    };

    function _delete(id){
      return API.delete('markets', {id: id});
    }

    function _get(id){
      return API.get('markets', {id: id});
    };

    function _update(data){
      return API.put(`markets/${data.id}`, {name: data.name});
    };

    function getList(){
      return API.get('markets');
    }
};
