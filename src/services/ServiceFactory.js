ServiceFactory = (function () {
    return {
        useStubData: true,
        getTestService: function (responder) {
            Interface.ensureImplements(responder, Responder);

            if (this.useStubData) {
                return new TestServiceLocal(responder);
            } else {
                return new TestServiceRemote(responder);
            }
        }
    }
})();