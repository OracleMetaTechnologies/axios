describe('interceptors', function () {
  beforeEach(function () {
    jasmine.Ajax.install();
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
    axios.interceptors.request.handlers = [];
    axios.interceptors.response.handlers = [];
  });

  it('should add a request interceptor', function (done) {
    axios.interceptors.request.use(function (config) {
      config.headers.test = 'added by interceptor';
      return config;
    });

    axios('/foo');

    getAjaxRequest().then(function (request) {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      });

      expect(request.requestHeaders.test).toBe('added by interceptor');
      done();
    });
  });

  it('should add a request interceptor that returns a new config object', function (done) {
    axios.interceptors.request.use(function () {
      return {
        url: '/bar',
        method: 'post'
      };
    });

    axios('/foo');

    getAjaxRequest().then(function (request) {
      expect(request.method).toBe('POST');
      expect(request.url).toBe('/bar');
      done();
    });
  });

  it('should add a request interceptor that returns a promise', function (done) {
    axios.interceptors.request.use(function (config) {
      return new Promise(function (resolve) {
        // do something async
        setTimeout(function () {
          config.headers.async = 'promise';
          resolve(config);
        }, 100);
      });
    });

    axios('/foo');

    getAjaxRequest().then(function (request) {
      expect(request.requestHeaders.async).toBe('promise');
      done();
    });
  });
