describe('requests', function () {
  beforeEach(function () {
    jasmine.Ajax.install();
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  it('should treat single string arg as url', function (done) {
    axios('/foo');

    getAjaxRequest().then(function (request) {
      expect(request.url).toBe('/foo');
      expect(request.method).toBe('GET');
      done();
    });
  });

  it('should treat method value as lowercase string', function (done) {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(function (response) {
      expect(response.config.method).toBe('post');
      done();
    });

    getAjaxRequest().then(function (request) {
      request.respondWith({
        status: 200
      });
    });
  });

  it('should allow string arg as url, and config arg', function (done) {
    axios.post('/foo');

    getAjaxRequest().then(function (request) {
      expect(request.url).toBe('/foo');
      expect(request.method).toBe('POST');
      done();
    });
  });

  it('should make an http request', function (done) {
    axios('/foo');

    getAjaxRequest().then(function (request) {
      expect(request.url).toBe('/foo');
      done();
    });
  });

  it('should reject on network errors', function (done) {
    // disable jasmine.Ajax since we're hitting a non-existant server anyway
    jasmine.Ajax.uninstall();

    var resolveSpy = jasmine.createSpy('resolve');
    var rejectSpy = jasmine.createSpy('reject');

    var finish = function () {
      expect(resolveSpy).not.toHaveBeenCalled();
      expect(rejectSpy).toHaveBeenCalled();
      var reason = rejectSpy.calls.first().args[0];
      expect(reason instanceof Error).toBe(true);
      expect(reason.config.method).toBe('get');
      expect(reason.config.url).toBe('http://thisisnotaserver/foo');
      expect(reason.request).toEqual(jasmine.any(XMLHttpRequest));

      // re-enable jasmine.Ajax
      jasmine.Ajax.install();

      done();
    };

    axios('http://thisisnotaserver/foo')
      .then(resolveSpy, rejectSpy)
      .then(finish, finish);
  });

  it('should reject on abort', function (done) {
    var resolveSpy = jasmine.createSpy('resolve');
    var rejectSpy = jasmine.createSpy('reject');

    var finish = function () {
      expect(resolveSpy).not.toHaveBeenCalled();
      expect(rejectSpy).toHaveBeenCalled();
      var reason = rejectSpy.calls.first().args[0];
      expect(reason instanceof Error).toBe(true);
      expect(reason.config.method).toBe('get');
      expect(reason.config.url).toBe('/foo');
      expect(reason.request).toEqual(jasmine.any(XMLHttpRequest));

      done();
    };

    axios('/foo')
      .then(resolveSpy, rejectSpy)
      .then(finish, finish);

    getAjaxRequest().then(function (request) {
      request.abort();
    });
  });

  it('should reject when validateStatus returns false', function (done) {
    var resolveSpy = jasmine.createSpy('resolve');
    var rejectSpy = jasmine.createSpy('reject');

    axios('/foo', {
      validateStatus: function (status) {
        return status !== 500;
      }
    }).then(resolveSpy)
      .catch(rejectSpy)
      .then(function () {
        expect(resolveSpy).not.toHaveBeenCalled();
        expect(rejectSpy).toHaveBeenCalled();
        var reason = rejectSpy.calls.first().args[0];
        expect(reason instanceof Error).toBe(true);
        expect(reason.message).toBe('Request failed with status code 500');
        expect(reason.config.method).toBe('get');
        expect(reason.config.url).toBe('/foo');
        expect(reason.response.status).toBe(500);

        done();
      });

    getAjaxRequest().then(function (request) {
      request.respondWith({
        status: 500
      });
    });
  });

  it('should resolve when validateStatus returns true', function (done) {
    var resolveSpy = jasmine.createSpy('resolve');
    var rejectSpy = jasmine.createSpy('reject');

    axios('/foo', {
      validateStatus: function (status) {
        return status === 500;
      }
    }).then(resolveSpy)
      .catch(rejectSpy)
      .then(function () {
        expect(resolveSpy).toHaveBeenCalled();
        expect(rejectSpy).not.toHaveBeenCalled();
        done();
      });

    getAjaxRequest().then(function (request) {
      request.respondWith({
        status: 500
      });
    });
  });

  // https://github.com/axios/axios/issues/378
  it('should return JSON when rejecting', function (done) {
    var response;

    axios('/api/account/signup', {
      username: null,
      password: null
    }, {
      method: 'post',
      headers: {
        'Accept': 'application/json'
      }
    })
    .catch(function (error) {
      response = error.response;
    });

    getAjaxRequest().then(function (request) {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      });
