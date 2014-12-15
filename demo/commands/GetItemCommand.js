function GetItemCommand(itemId) {
    this.itemId = itemId;
}

GetItemCommand.prototype = Object.create(CommandAdapter.prototype);

GetItemCommand.prototype.execute = function () {
    ServiceFactory.getTestService(this).getItem(this.itemId);
}
