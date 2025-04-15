function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file && file.type === "text/csv") {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = parseCSV(event.target.result);
            // Pass data to the visualization and CODAP functions
            sendDataToCODAP(data);
        };
        reader.readAsText(file);
    } else {
        alert("Please upload a valid CSV file.");
    }
}

function parseCSV(csvData) {
    const rows = csvData.split("\n");
    const headers = rows[0].split(",");
    const data = rows.slice(1).map(row => {
        const values = row.split(",");
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
    return data;
}

function sendDataToCODAP(data) {
    // Assuming you're working with CSV data
    console.log(data); // Check if the data looks right

    // Call visualization function to draw the chart
    drawParallelCoordinates(data);
}

function getDataFromCODAP() {
    // Replace "YourCollectionName" with the actual collection name you want to load
    const collectionName = "Survey Data"; // Example collection name

    codapInterface.getData(collectionName).then(data => {
        console.log("Fetched Data from CODAP:", data);
        drawParallelCoordinates(data);  // Visualize the data
    }).catch(err => {
        console.error("Error fetching data from CODAP", err);
    });
}


