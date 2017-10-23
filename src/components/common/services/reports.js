const reportsService = (API) => {
  const getReports = () =>
    API.get('report/')

  const getAllReportsExcel = () =>
    API.get('report/xls/all');

  const getReportExcel = (id) =>
    API.get(`report/xls/${id}`);

  const getPeriodReportExcel = (from, to) =>
    API.get(`report/xls/${from}/${to}`);

  const service = {
    getReports,
    getAllReportsExcel,
    getReportExcel,
    getPeriodReportExcel
  };

  return service;
}

$app.factory('reportsService', reportsService);

reportsService.$inject = ['API'];
