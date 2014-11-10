function GetQueueRequestCommand (queueNumber) {
    this.queueNumber = queueNumber;
}

GetQueueRequestCommand.prototype = Object.create(CommandAdapter.prototype);

GetQueueRequestCommand.prototype.execute = function () {
    ServiceFactory.getQueueService(this).getQueueRequest(this.queueNumber);
}