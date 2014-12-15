(function() {
"use strict"

    var root = this;
    var previous_commandadapter = root.commandadapter;

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

    CommandAdapter.noConflict = function() {
        root.commandadapter = previous_commandadapter;
        return CommandAdapter;
    }

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
          exports = module.exports = CommandAdapter;
        }
        exports.commandadapter = CommandAdapter;
      } else {
        root.commandadapter = CommandAdapter;
    }
}).call(this);
