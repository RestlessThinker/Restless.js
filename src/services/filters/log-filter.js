function LogFilter() { // implements AsyncFilter
    FilterChain.call(this);
}

LogFilter.prototype = Object.create(FilterChain.prototype);

LogFilter.prototype.doFilter = function (data) {
    this.data = data + 'AppendedFromLogFilter';
    if (this.next) {
        this.data = this.next.doFilter(this.data);
    }
    return this.data;
}
