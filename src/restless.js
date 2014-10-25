function CommandAdapter() { // implements Responder
    this.resultCallback = null;
    this.faultCallback = null;
}

CommandAdapter.prototype.execute = function () {};

CommandAdapter.prototype.setCallbacks = function (resultHandler, faultHandler) {
    this.resultCallback = resultHandler || null;
    this.faultCallback = faultHandler || null;
    return this;
}

CommandAdapter.prototype.setResult = function (data) {
    this.resultCallback(data);
}

CommandAdapter.prototype.setFault = function (data) {
    this.faultCallback(data);
}




function FilterChain() { // implements AsyncFilter
    this.data = null;
    this.next = null;
}

FilterChain.prototype.doFilter = function () {};

FilterChain.prototype.addFilter = function (filter) {
    Interface.ensureImplements(filter, AsyncFilter);
    this.next = filter;
}




function ServiceFilterAdapter(responder) { // implements AsyncFilter
    Interface.ensureImplements(responder, Responder);
    this.responder = responder;
    this.preFilterStack = null;
    this.data;
}

ServiceFilterAdapter.prototype.doFilter = function (data) {
    if (this.preFilterStack) {
        this.data = this.preFilterStack.doFilter(data);
    } else {
        this.data = data;
    }
    return this.data;
}

ServiceFilterAdapter.prototype.invoke = function (url, method, data) {
    this.doFilter(data);
    console.log(this.data);
    var _this = this;
    return $.ajax({
            type: method,
            url: url,
            data: this.data,
            dataType: 'json'
           }).then(function (data) {
                _this.responder.setResult(data);
           }, function (data) {
                _this.responder.setFault(data);
           });
}