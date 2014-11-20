function LogFilter() { // implements AsyncFilter
    FilterChain.call(this);
}

LogFilter.prototype = Object.create(FilterChain.prototype);

LogFilter.prototype.doFilter = function (data, xhr) {
    var newData = data + 'AppendedFromLogFilter';
    if (this.next) {
        newData = this.next.doFilter(newData, xhr);
    }
    return newData;
}
