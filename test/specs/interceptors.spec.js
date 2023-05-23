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

  it('should add multiple request interceptors', function (done) {
    axios.interceptors.request.use(function (config) {
      config.headers.test1 = '1';
      return config;
    });
    axios.interceptors.request.use(function (config) {
      config.headers.test2 = '2';
      return config;
    });
    axios.interceptors.request.use(function (config) {
      config.headers.test3 = '3';
      return config;
    });

    axios('/foo');

    getAjaxRequest().then(function (request) {
      expect(request.requestHeaders.test1).toBe('1');
      expect(request.requestHeaders.test2).toBe('2');
      expect(request.requestHeaders.test3).toBe('3');
      done();
    });
  });

  it('should add a response interceptor', function (done) {
    var response;

    axios.interceptors.response.use(function (data) {
      data.data = data.data + ' - modified by interceptor';
      return data;
    });

    axios('/foo').then(function (data) {
      response = data;
    });

    getAjaxRequest().then(function (request) {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      });

      setTimeout(function () {
        expect(response.data).toBe('OK - modified by interceptor');
        done();
      }, 100);
    });
  });

  it('should add a response interceptor that returns a new data object', function (done) {
    var response;

    axios.interceptors.response.use(function () {
      return {
        data: 'stuff'
      };
    });

    axios('/foo').then(function (data) {
      response = data;
    });

    getAjaxRequest().then(function (request) {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      });

      setTimeout(function () {
        expect(response.data).toBe('stuff');
        done();
      }, 100);
    });
  });
