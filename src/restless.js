function CommandAdapter() { // implements Responder
    this.resultCallback = null;
    this.faultCallback = null;
    this.alwaysCallback = null;
}

CommandAdapter.prototype.execute = function () {};

CommandAdapter.prototype.then = function (resultHandler, faultHandler) {
    this.resultCallback = resultHandler || null;
    this.faultCallback = faultHandler || null;
    return this;
}

CommandAdapter.prototype.always = function (alwaysHandler) {
    this.alwaysCallback = alwaysHandler || null;
    return this;
}

CommandAdapter.prototype.setResult = function (data) {
    this.resultCallback(data);
}

CommandAdapter.prototype.setFault = function (data) {
    this.faultCallback(data);
}

CommandAdapter.prototype.setAlways = function (data) {
    this.alwaysCallback(data);
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
           }).always(function (data) {
                _this.responder.setAlways(data);
           });
}




function RestlessCommandQueue() {
    this.commands = null;
    this.resultCallback = null;
    this.arrayOfCommands = [];
    this.arrayOfResults = []; //FIFO
    this.arrayOfErrors = [];

    function assignResult(command, data) {
        this.arrayOfResults[this.arrayOfCommands.indexOf(command)] = data;
    }

    this.assignResult = assignResult;
}

RestlessCommandQueue.prototype.addCommands = function (commandArray) {
    this.commands = commandArray;
    return this;
}

RestlessCommandQueue.prototype.executeSeries = function (resultHandler) {
    this.resultCallback = resultHandler;

    var commandCount = this.commands.length;
    for (var i = 0; i < commandCount; i++) {
        var command = this.commands[i];
        var _this = this;
        var _i = i;

        Interface.ensureImplements(command, Command);
        this.arrayOfCommands[i] = command;

        command.setCallbacks(function (data) {
            _this.assignResult(this, data);
            if (_this.arrayOfResults.length == commandCount) {
                _this.resultCallback(_this.arrayOfErrors, _this.arrayOfResults);
            }
        }, function (data) {
            _this.arrayOfErrors[_i] = data;
            if (_this.arrayOfResults.length == commandCount) {
                _this.resultCallback(_this.arrayOfErrors, _this.arrayOfResults);
            }
        });
        command.execute();
    }
}

RestlessCommandQueue.prototype.executeParallel = function () {

}