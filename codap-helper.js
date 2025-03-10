const codapInterface = {
    init: async function () {
        await codapInterface.sendRequest({
            action: "update",
            resource: "interactiveFrame",
            values: {
                name: "Parallel Coordinates",
                dimensions: { width: 800, height: 500 }
            }
        });
    },

    sendRequest: async function (message) {
        return new Promise(resolve => {
            window.parent.postMessage(message, "*");
            window.addEventListener("message", event => resolve(event.data));
        });
    },

    getData: async function (collectionName) {
        const response = await codapInterface.sendRequest({
            action: "get",
            resource: `dataContext[${collectionName}].collection`
        });

        return response.values.cases.map(c => c.values);
    }
};

// Initialize plugin
codapInterface.init();
