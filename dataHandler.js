// Get data from CODAP
async function getDataFromCODAP() {
    let result = await codapInterface.sendRequest({
        action: "get",
        resource: "dataContextList"
    });

    if (result.success && result.values.length > 0) {
        let contextName = result.values[0].name;
        let dataset = await codapInterface.sendRequest({
            action: "get",
            resource: `dataContext[${contextName}].caseTable`
        });

        let data = dataset.values.map(d => d.values);
        drawParallelCoordinates(data);  // Call visualization function
    } else {
        alert("No dataset found! Please add data in CODAP.");
    }
}

// Send uploaded data to CODAP
async function sendDataToCODAP(data) {
    let contextName = "UserDataset";

    await codapInterface.sendRequest({
        action: "create",
        resource: "dataContext",
        values: {
            name: contextName,
            collections: [{
                name: "Cases",
                attrs: Object.keys(data[0]).map(attr => ({ name: attr }))
            }]
        }
    });

    await codapInterface.sendRequest({
        action: "create",
        resource: `dataContext[${contextName}].caseTable`,
        values: data.map(row => ({ values: row }))
    });

    alert("Dataset uploaded successfully!");
}
