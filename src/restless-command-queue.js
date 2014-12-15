(function () {
"use strict"

    var root = this;
    var previous_restlesscommandqueue = root.restlesscommandqueue;

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

    RestlessCommandQueue.noConflict = function() {
        root.restlesscommandqueue = previous_restlesscommandqueue;
        return RestlessCommandQueue;
    }

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
          exports = module.exports = RestlessCommandQueue;
        }
        exports.restlesscommandqueue = RestlessCommandQueue;
      } else {
        root.restlesscommandqueue = RestlessCommandQueue;
    }
}).call(this);
