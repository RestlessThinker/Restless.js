function TestServiceLocal (responder) { // implements TestService
    Interface.ensureImplements(responder, Responder);
    this.responder = responder;
}

TestServiceLocal.prototype.getItem = function (itemId) {
    var sampleResponse = {id: 'someId', name: 'foo'};
    this.responder.setResult(sampleResponse);
}