function EmberObjectEncoderFilter() { // implements AsyncFilter
    FilterChain.call(this);
}

EmberObjectEncoderFilter.prototype = Object.create(FilterChain.prototype);

EmberObjectEncoderFilter.prototype.doFilter = function (data) {
    // you can make this an ember object like:
    // data.response = SomeEmberObject.create(data.response);
    data.response = {type: 'someEmberObject', foo: data.someProperty};
    return data;
}