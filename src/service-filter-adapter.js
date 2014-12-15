
(function() {
"use strict"

    var root = this;
    var has_require = typeof require !== 'undefined';
    var $ = root.$;
    var XMLHttpRequest = root.XMLHttpRequest;

    // todo maybe look into using superagent-browserify
    // so you don't have to be dependant on jquery just for services
    // you'd have to include superagent-promise
    if( typeof $ === 'undefined' ) {
        if( has_require ) {
            $ = require('jquery')(require("jsdom").jsdom().parentWindow);
            XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        }
        else throw new Error('servicefilteradapter requires jquery, see http://jquery.org');
    }

    var Interface = require('./interface'),
        Responder = require('./interface-responder'),
        previous_servicefilteradapter = root.servicefilteradapter;

    // for nodejs
    $.support.cors = true;
    $.ajaxSettings.xhr = function () {
        return new XMLHttpRequest;
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

    ServiceFilterAdapter.noConflict = function() {
        root.servicefilteradapter = previous_servicefilteradapter;
        return ServiceFilterAdapter;
    }

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
          exports = module.exports = ServiceFilterAdapter;
        }
        exports.servicefilteradapter = ServiceFilterAdapter;
      } else {
        root.servicefilteradapter = ServiceFilterAdapter;
    }
}).call(this);
