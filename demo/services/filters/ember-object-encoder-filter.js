function EmberObjectEncoderFilter() { // implements AsyncFilter
    FilterChain.call(this);
}

EmberObjectEncoderFilter.prototype = Object.create(FilterChain.prototype);

EmberObjectEncoderFilter.prototype.doFilter = function (data, xhr) {
    // you can make this an ember object like:
    // data.response = SomeEmberObject.create(data.response);
    data.response = {type: 'someEmberObject', foo: data.someProperty};

    var newData = data;
    if (this.next) {
        Interface.ensureImplements(this.next, AsyncFilter);
        newData = this.next.doFilter(newData, xhr);
    }
    return newData;
}