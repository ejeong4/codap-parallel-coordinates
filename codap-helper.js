// const codapInterface = {
//     init: async function () {
//         // const message = await codapInterface.sendRequest({
//         //     action: "update",
//         //     resource: "interactiveFrame",
//         //     values: {
//         //         name: "Parallel Coordinates",
//         //         dimensions: { width: 1000, height: 1000 }
//         //     }
//         // });
//         // console.log("Sending message:", message);
//         // const response = await codapInterface.sendRequest(message);
//         // console.log("Received response:", response);
//         const message = await codapInterface.sendRequest({
//             action: "get",
//             resource: "interactiveFrame"  // Or another resource, if 'interactiveFrame' isn't valid
//         });
//         console.log("Received data:", message);
//     },

//     sendRequest: async function (message) {
//         return new Promise(resolve => {
//             window.parent.postMessage(message, "*");
//             window.addEventListener("message", event => resolve(event.data));
//         });
//     },

//     getData: async function (collectionName) {
//         const response = await codapInterface.sendRequest({
//             action: "get",
//             resource: `dataContext[${collectionName}].collection`
//         });

//         return response.values.cases.map(c => c.values);
//     }
// };

// // Initialize plugin
// codapInterface.init();

const codapInterface = {
    init: async function () {
        // Send the update request for the interactiveFrame dimensions
        const updateMessage = {
            action: "update",
            resource: "interactiveFrame",
            values: {
                dimensions: { width: 1000, height: 1000 }
            }
        };

        // Send the update message
        await codapInterface.sendRequest(updateMessage);
        console.log("Dimensions updated");

        // Send the get request to fetch the current state of the interactiveFrame
        const getMessage = {
            action: "get",
            resource: "interactiveFrame"
        };

        // Fetch the current state of the interactiveFrame after the update
        const response = await codapInterface.sendRequest(getMessage);
        console.log("Received response:", response);
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
