function TestFilterServiceRemote (responder) {
    ServiceFilterAdapter.call(this, responder);
}

TestFilterServiceRemote.prototype = Object.create(ServiceFilterAdapter.prototype);

TestFilterServiceRemote.prototype.doPreFilter = function (data) {
    var cacheFilter = new CacheFilter(this.responder);
    var logFilter = new LogFilter();
    logFilter.addFilter(cacheFilter);
    this.preFilterStack = logFilter;
    return ServiceFilterAdapter.prototype.doPreFilter.call(this, data);
}

TestFilterServiceRemote.prototype.doPostFilter = function (data) {
    var emberEncoder = new EmberObjectEncoderFilter();
    this.postFilterStack = emberEncoder;
    return ServiceFilterAdapter.prototype.doPostFilter.call(this, data);
}

TestFilterServiceRemote.prototype.getItemById = function (itemId) {
    return ServiceFilterAdapter.prototype.invoke.call(this, 'http://localhost:3000/getItemById', 'GET', itemId);
}