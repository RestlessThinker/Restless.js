ServiceFactory = (function () {
    return {
        useStubData: false,
        getTestService: function (responder) {
            Interface.ensureImplements(responder, Responder);

            if (this.useStubData) {
                return new TestServiceLocal(responder);
            } else {
                return new TestServiceRemote(responder);
            }
        },

        getTestFilterService: function (responder) {
            Interface.ensureImplements(responder, Responder);

            if (this.useStubData) {
                return new TestFilterServiceLocal(responder);
            } else {
                return new TestFilterServiceRemote(responder);
            }
        },

        getQueueService: function (responder) {
            Interface.ensureImplements(responder, Responder);

            return new QueueServiceRemote(responder);
        }
    }
})();