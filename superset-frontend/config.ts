const Config = {
  // Local
  // supersetClientClass: {
  //   baseUrl: 'http://localhost:8080/proxy',
  //   host: 'localhost:8080/proxy',
  //   port: '8080',
  // },
  // chartConfig: {
  //   host: 'localhost',
  //   path: '/proxy',
  //   port: '8080',
  // },

  // QA
  supersetClientClass: {
    baseUrl: 'https://testops-g3-ra-bff.qa.katalon.com/proxy',
    host: 'testops-g3-ra-bff.qa.katalon.com/proxy',
    port: '',
  },
  chartConfig: {
    host: 'testops-g3-ra-bff.qa.katalon.com',
    path: '/proxy',
    port: '',
  },
};

export default Config;
