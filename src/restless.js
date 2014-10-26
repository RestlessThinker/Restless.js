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




function FilterChain(responder) { // implements AsyncFilter
    this.data = null;
    this.next = null;
    this.responder = responder || null;
}

FilterChain.prototype.doFilter = function () {};

FilterChain.prototype.addFilter = function (filter) {
    Interface.ensureImplements(filter, AsyncFilter);
    this.next = filter;
}




function ServiceFilterAdapter(responder) {
    Interface.ensureImplements(responder, Responder);
    this.responder = responder;
    this.preFilterStack = null;
    this.postFilterStack = null;
}

ServiceFilterAdapter.prototype.doPreFilter = function (data) {
    var newData = data;
    if (this.preFilterStack) {
        Interface.ensureImplements(this.preFilterStack, AsyncFilter);
        newData = this.preFilterStack.doFilter(data);
    }
    return newData;
}

ServiceFilterAdapter.prototype.doPostFilter = function (data) {
    var postData = data;
    if (this.postFilterStack) {
        Interface.ensureImplements(this.postFilterStack, AsyncFilter);
        postData = this.postFilterStack.doFilter(data);
    }
    return postData;
}

ServiceFilterAdapter.prototype.invoke = function (url, method, data) {
    var newData = this.doPreFilter(data);
    if (!newData) return;
    var _this = this;
    return $.ajax({
            type: method,
            url: url,
            data: newData,
            dataType: 'json'
           }).then(function (data) {
                var postData = _this.doPostFilter(data);
                _this.responder.setResult(postData);
           }, function (data) {
                _this.responder.setFault(data);
           });
}