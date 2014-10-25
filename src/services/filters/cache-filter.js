function CacheFilter() { // implements AsyncFilter
    FilterChain.call(this);
}

CacheFilter.prototype = Object.create(FilterChain.prototype);

CacheFilter.prototype.doFilter = function (data) {
    this.data = data + 'AppendedFromCacheFilter';
    if (this.next) {
        this.data = this.next.doFilter(this.data);
    }
    return this.data;
}
