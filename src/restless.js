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




function ServiceFilterAdapter(responder) {
    Interface.ensureImplements(responder, Responder);
    this.responder = responder;
}

ServiceFilterAdapter.prototype.invoke = function (url, method, data) {
    var _this = this;
    return $.ajax({
            type: method,
            url: url,
            data: data,
            dataType: 'json'
           }).then(function (data) {
                _this.responder.setResult(data);
           }, function (data) {
                _this.responder.setFault(data);
           });
}