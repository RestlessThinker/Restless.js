
(function () {
"use strict"

    var root = this;
    var previous_filterchain = root.filterchain;

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

    FilterChain.noConflict = function() {
        root.filterchain = previous_filterchain;
        return FilterChain;
    }

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
          exports = module.exports = FilterChain;
        }
        exports.filterchain = FilterChain;
      } else {
        root.filterchain = FilterChain;
    }

}).call(this);
