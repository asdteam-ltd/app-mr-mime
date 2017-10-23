$app.factory('categoriesDataService', categoriesDataService);

categoriesDataService.$inject = ['API'];

function categoriesDataService(API){
    const service = {
        add: _add,
        delete: _delete,
        get: _get,
        update: _update,
        getList: getList
    };
    return service;

    function _add(data){
      return API.post('categories', {name: data.name});
    };

    function _delete(id){
      return API.delete('categories', {id: id});
    }

    function _get(id){
      return API.get('categories', {id: id});
    };

    function _update(data){
      return API.put(`categories/${data.id}`, {name: data.name});
    };

    function getList(){
        return  API.get('categories');
    };
};
