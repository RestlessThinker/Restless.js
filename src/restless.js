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
};

CommandAdapter.prototype.always = function (alwaysHandler) {
    this.alwaysCallback = alwaysHandler || null;
    return this;
};

CommandAdapter.prototype.setResult = function (data) {
    if (this.resultCallback) {
        return this.resultCallback(data);
    }
};

CommandAdapter.prototype.setFault = function (data) {
    if (this.faultCallback) {
        return this.faultCallback(data);
    }
};

CommandAdapter.prototype.setAlways = function (data) {
    if (this.alwaysCallback) {
        return this.alwaysCallback(data);
    }
};




function FilterChain(responder) { // implements AsyncFilter
    this.data = null;
    this.next = null;
    this.responder = responder || null;
}

FilterChain.prototype.doFilter = function () {};

FilterChain.prototype.addFilter = function (filter) {
    Interface.ensureImplements(filter, AsyncFilter);
    this.next = filter;
};




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
};

ServiceFilterAdapter.prototype.doPostFilter = function (data, xhr) {
    var postData = data;
    if (this.postFilterStack) {
        Interface.ensureImplements(this.postFilterStack, AsyncFilter);
        postData = this.postFilterStack.doFilter(data, xhr);
    }
    return postData;
};

ServiceFilterAdapter.prototype.invoke = function (url, method, data) {
    // if no parameters are set, we don't need pre-filters
    var newData = this.doPreFilter(data);
    if (typeof(data) !== 'undefined' || typeof(newData) !== 'undefined') {
        if (!newData) {
            return;
        }
    }
    var _this = this;
    var options = {
            type: method,
            url: url,
            processData: true,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded'
        };
    if (typeof(data) !== 'undefined' && data !== null) {
        options.data = newData;
    }
    return $.ajax(options
           ).then(function (data, textStatus, jqXHR) {
                var postData = _this.doPostFilter(data, jqXHR);
                return _this.responder.setResult(postData);
           }, function (jqXHR) {
                var postData = _this.doPostFilter(null, jqXHR);
                if (!postData) {
                    return;
                }
                return _this.responder.setFault(postData);
           }).always(function (data) {
                return _this.responder.setAlways(data);
           });
};




function RestlessCommandQueue() {
    this.commands = null;
    this.resultCallback = null;
    this.queueOfCommands = [];
    this.queueOfResults = []; //FIFO
    this.queueOfErrors = [];

    function assignResult(command, data) {
        this.queueOfResults[this.queueOfCommands.indexOf(command)] = data;
    }

    function assignFault(command, data) {
        this.queueOfErrors[this.queueOfCommands.indexOf(command)] = data;
    }

    this.assignResult = assignResult;
    this.assignFault = assignFault;
}

RestlessCommandQueue.prototype.addCommands = function (commandArray) {
    this.commands = commandArray;
    return this;
};

RestlessCommandQueue.prototype.executeSeries = function (resultHandler) {
    this.resultCallback = resultHandler;

    var commandCount = this.commands.length;
    for (var i = 0; i < commandCount; i++) {
        var command = this.commands[i];
        var _this = this;

        Interface.ensureImplements(command, Command);
        this.queueOfCommands[i] = command;

        command.then(function (data) {
            _this.assignResult(this, data);
            if (_this.queueOfResults.length == commandCount) {
                _this.resultCallback(_this.queueOfErrors, _this.queueOfResults);
            }
        }, function (data) {
            _this.assignFault(this, data);
            if (_this.queueOfResults.length == commandCount) {
                _this.resultCallback(_this.queueOfErrors, _this.queueOfResults);
            }
        });
        command.execute();
    }
};
