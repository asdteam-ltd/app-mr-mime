const itemsDataService = (API) => {
  const _add = (data) =>
    API.post(`items`, Object.assign({}, data, {
      categories: data.category,
      markets: data.market,
      count: 'enough',
      inBuyList: false
    }));

  const editItem = (data) =>
    API.put('items', data);

  const _delete = (id) =>
    API.delete('items', { id });

  const getAll = () =>
    API.get('items/');

  const setAsOver = (id) =>
    API.put(`items/over/${id}`);

  const setAsFew = (id) =>
    API.put(`items/few/${id}`);

  const setAsEnough = (id) =>
    API.put(`items/enough/${id}`);

  const markAsBought = (id) =>
    API.put(`items/mark-as-bought/${id}`);

  const purchase = (ids, total) =>
    API.put(`items/purchase/${ids}/${total}`)

  const addToBuyList = (id) =>
    API.put(`items/add-to-buy-list/${id}`);

  const removeFromBuyList = (id) =>
    API.put(`items/remove-from-buy-list/${id}`);

  const getReports = () =>
    API.get('report/')


  const service = {
    add: _add,
    delete: _delete,
    getAll,
    setAsOver,
    setAsFew,
    setAsEnough,
    addToBuyList,
    markAsBought,
    purchase,
    removeFromBuyList,
    getReports,
    editItem
  };

  return service;
}

$app.factory('itemsDataService', itemsDataService);

itemsDataService.$inject = ['API'];
