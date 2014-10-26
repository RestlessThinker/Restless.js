function LogFilter() { // implements AsyncFilter
    FilterChain.call(this);
}

LogFilter.prototype = Object.create(FilterChain.prototype);

LogFilter.prototype.doFilter = function (data) {
    var newData = data + 'AppendedFromLogFilter';
    if (this.next) {
        newData = this.next.doFilter(newData);
    }
    return newData;
}
