
(function () {

    var Interface = require('./interface'),
        root = this,
        previous_interfaceresponder = root.interfaceresponder;

    var Responder = new Interface('Responder', ['setResult', 'setFault', 'setAlways']);

    Responder.noConflict = function() {
        root.responder = previous_commandadapter;
        return Responder;
    }

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
          exports = module.exports = Responder;
        }
        exports.responder = Responder;
      } else {
        root.responder = Responder;
    }
}).call(this);