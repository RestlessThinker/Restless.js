function TestFilterServiceRemote (responder) {
    ServiceFilterAdapter.call(this, responder);
}

TestFilterServiceRemote.prototype = Object.create(ServiceFilterAdapter.prototype);

TestFilterServiceRemote.prototype.doFilter = function (data) {
    var cacheFilter = new CacheFilter();
    var logFilter = new LogFilter();
    logFilter.addFilter(cacheFilter);
    this.preFilterStack = logFilter;
    ServiceFilterAdapter.prototype.doFilter.call(this, data);
}

TestFilterServiceRemote.prototype.getItemById = function (itemId) {
    return ServiceFilterAdapter.prototype.invoke.call(this, 'http://localhost/getItemById', 'GET', itemId);
}