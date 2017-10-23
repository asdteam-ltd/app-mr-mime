$app.controller('reportCtrl', reportCtrl);

reportCtrl.$inject = ['itemsDataService', 'reportsService', 'notificationService'];

function reportCtrl(itemsDataService, reportsService, notificationService) {
    const vm = this;

    vm.state = {};


    vm.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    vm.activeMonth = vm.months[0];

    vm.years = ['2017', '2018'];
    vm.activeYear = vm.years[0];

    vm.allData = [];
    vm.data = [];

    vm.total = 0;

    const rerangeData = () => {
      const m = this.activeMonth;
      const y = this.activeYear;
      vm.data = vm.allData.filter((item) =>
        new Date(item.createdAt).getFullYear() === vm.activeYear &&
        moment(new Date(item.createdAt)).month('MMM').format('MMM') === vm.activeMonth
      );
      vm.total = vm.data.reduce((acc, c) => acc + c.price, 0);
    }

    const setYears = (data) => {
      vm.years = data.reduce((acc, c) =>
        acc.includes(new Date(c.createdAt).getFullYear())
          ? acc
          : [...acc, new Date(c.createdAt).getFullYear()]
      , []);
      vm.activeYear = vm.years[0];
    }

    this.selectMonth = (month) => {
      vm.activeMonth = month;
      this.toggleMonthsDropdown();
      rerangeData();
    }

    this.selectYear = (year) => {
      vm.activeYear = year;
      this.toggleYearsDropdown();
      rerangeData();
    }

    vm.monthsDropdownVisible = false;
    vm.yearsDropdownVisible = false;

    this.toggleMonthsDropdown = () => {
      vm.monthsDropdownVisible = !vm.monthsDropdownVisible;
    }

    this.toggleYearsDropdown = () => {
      vm.yearsDropdownVisible = !vm.yearsDropdownVisible;
    }

    const init = () => {
      reportsService.getReports()
        .then(({ data }) => {
          vm.allData = data.map(item => Object.assign({}, item, {
            date: moment(item.createdAt).format('DD MMM YYYY')
          }));
          setYears(data);
          rerangeData();
        });
    };

    init();

    // Excel
    this.toExcel = () => {
      if (vm.data.length) {
        const from = moment(vm.data[0].createdAt).format('YYYY-MM-DD');
        const to = moment(vm.data[vm.data.length - 1].createdAt).format('YYYY-MM-DD');
        reportsService.getPeriodReportExcel(from, to)
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => console.log(err));
      }
    }
}
