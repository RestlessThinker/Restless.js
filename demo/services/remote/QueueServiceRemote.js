function QueueServiceRemote (responder) {
    ServiceFilterAdapter.call(this, responder);
}

QueueServiceRemote.prototype = Object.create(ServiceFilterAdapter.prototype);

QueueServiceRemote.prototype.getQueueRequest = function (queueNumber) {
    return ServiceFilterAdapter.prototype.invoke.call(this, 'http://localhost:3000/queue' + queueNumber, 'GET', 1);
}