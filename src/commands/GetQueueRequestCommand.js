function GetQueueRequestCommand (queueNumber) {
    this.queueNumber = queueNumber;
}

GetQueueRequestCommand.prototype = Object.create(CommandAdapter.prototype);

GetQueueRequestCommand.prototype.execute = function () {
    return ServiceFactory.getQueueService(this).getQueueRequest(this.queueNumber);
}