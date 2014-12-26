(function () {
    
    var Interface = require('./interface'),
        root = this,
        previous_interfaceasyncfilter = root.interfaceasyncfilter;

    var AsyncFilter = new Interface('AsyncFilter', ['doFilter']);

    AsyncFilter.noConflict = function () {
        root.interfaceasyncfilter = previous_interfaceasyncfilter;
        return AsyncFilter;
    }

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
          exports = module.exports = AsyncFilter;
        }
        exports.asyncfilter = AsyncFilter;
      } else {
        root.asyncfilter = AsyncFilter;
    }
}).call(this);