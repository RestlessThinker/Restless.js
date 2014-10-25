function TestFilterServiceLocal (responder) { // implements TestFilterService
    Interface.ensureImplements(responder, Responder);
    this.responder = responder;
}

TestFilterServiceLocal.prototype.getItemById = function (itemId) {
    var response = {id: 'someId', name: 'bar'};
    this.responder.setResult(response);
}