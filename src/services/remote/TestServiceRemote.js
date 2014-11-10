function TestServiceRemote(responder) { // implements TestService
    ServiceFilterAdapter.call(this, responder);
}

TestServiceRemote.prototype = Object.create(ServiceFilterAdapter.prototype);

TestServiceRemote.prototype.getItem = function (itemId) {
    return ServiceFilterAdapter.prototype.invoke.call(this, 'http://localhost:3000/getItem', 'GET', itemId);
}