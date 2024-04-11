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
  // masterApp: 'http://localhost:5173',

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
  masterApp: 'https://platform.qa.katalon.com',
};

export default Config;
