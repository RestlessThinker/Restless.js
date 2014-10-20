function GetItemCommand(itemId) {
    this.itemId = itemId;
}

GetItemCommand.prototype = Object.create(CommandAdapter.prototype);

GetItemCommand.prototype.execute = function () {
    var service = ServiceFactory.getTestService(this);
    Interface.ensureImplements(service, TestService);
    service.getItem(this.itemId);
}
