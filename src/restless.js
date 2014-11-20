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
    if (this.resultCallback) {
        return this.resultCallback(data);
    }
}

CommandAdapter.prototype.setFault = function (data) {
    if (this.faultCallback) {
        return this.faultCallback(data);
    }
}

CommandAdapter.prototype.setAlways = function (data) {
    if (this.alwaysCallback) {
        return this.alwaysCallback(data);
    }
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
    if (!newData) {
        return;
    }
    var _this = this;
    return $.ajax({
            type: method,
            url: url,
            data: newData,
            dataType: 'json'
           }).then(function (data, textStatus, jqXHR) {
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

    function assignFault(command, data) {
        this.arrayOfErrors[this.arrayOfCommands.indexOf(command)] = data;
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

        Interface.ensureImplements(command, Command);
        this.arrayOfCommands[i] = command;

        command.then(function (data) {
            _this.assignResult(this, data);
            if (_this.arrayOfResults.length == commandCount) {
                _this.resultCallback(_this.arrayOfErrors, _this.arrayOfResults);
            }
        }, function (data) {
            _this.assignFault(this, data);
            if (_this.arrayOfResults.length == commandCount) {
                _this.resultCallback(_this.arrayOfErrors, _this.arrayOfResults);
            }
        });
        command.execute();
    }
}

RestlessCommandQueue.prototype.executeParallel = function () {
    var tasks = [];
    var commandCount = this.commands.length;
    var _this = this;
    for (var i = 0; i < commandCount; i++) {
        var command = this.commands[i];

        Interface.ensureImplements(command, Command);
        this.arrayOfCommands[i] = command;

        var task = function () {
            command.then(function (data) {
                _this.assignResult(this, data);
            }, function (data) {
                _this.assignFault(this, data);
            }).execute();
        }
        tasks[i] = task;
    }

    async.parallel(tasks, function (errors, arrayOfResults) {
        _this.resultCallback(_this.arrayOfErrors, _this.arrayOfResults);
    });
}