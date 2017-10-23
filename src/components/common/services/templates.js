const templatesService = (API) => {
  const createTemplate = (name, items) =>
    API.post('templates', { name, items });

  const updateTemplate = (id, name, items) =>
    API.put(`templates/${id}`, { name, items });

  const deleteTemplate = (id) =>
    API.delete(`templates/${id}`);

  const getTemplates = () =>
    API.get('templates');

  const getTemplate = (id) =>
    API.get(`templates/${id}`);

  const service = {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplates,
    getTemplate,
  };

  return service;
}

$app.factory('templatesService', templatesService);

templatesService.$inject = ['API'];
