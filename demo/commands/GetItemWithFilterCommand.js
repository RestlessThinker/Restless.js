function GetItemWithFilterCommand(itemId) {
    this.itemId = itemId;
}

GetItemWithFilterCommand.prototype = Object.create(CommandAdapter.prototype);

GetItemWithFilterCommand.prototype.execute = function () {
    ServiceFactory.getTestFilterService(this).getItemById(this.itemId);
}