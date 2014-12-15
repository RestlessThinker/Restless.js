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

/*
// to get this working comment out cache filter in doPreFilter
// because cache filter returns before service call gets executed and
// post filter is not needed
TestFilterServiceRemote.prototype.doPostFilter = function (data) {
    var emberEncoder = new EmberObjectEncoderfilter();
    this.postFilterStack = emberEncoder;
    return ServiceFilterAdapter.prototype.doPostFilter.call(this, data);
}
*/

TestFilterServiceRemote.prototype.getItemById = function (itemId) {
    return ServiceFilterAdapter.prototype.invoke.call(this, 'http://localhost/getItemById', 'GET', itemId);
}