function CacheFilter(responder) { // implements AsyncFilter
    FilterChain.call(this, responder);
}

CacheFilter.prototype = Object.create(FilterChain.prototype);

CacheFilter.prototype.doFilter = function (data) {
    // simulating cache found
    // invoke the responder success and return false
    var newData = 'cachedDataFromFilter';
    this.responder.setResult(newData);
    return false;
}
