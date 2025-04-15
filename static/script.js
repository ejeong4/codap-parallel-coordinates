// let featureNames = [];
// let currentClusters = [];

// document.getElementById("upload-form").addEventListener("submit", function(event) {
//     event.preventDefault();
//     let formData = new FormData();
//     formData.append("csv_file", document.getElementById("csv_file").files[0]);

//     fetch('/run_kmeans', {
//         method: 'POST',
//         body: formData
//     })
//     .then(res => res.json())
//     .then(data => {
//         currentClusters = data.clusters;
//         featureNames = data.feature_names;
//         populateFeatureDropdowns(featureNames);
//         renderCurrentClusters();  // Initial chart rendering
//     });
// });

// function populateFeatureDropdowns(features) {
//     const xSelect = document.getElementById('x-feature');
//     const ySelect = document.getElementById('y-feature');

//     // Clear previous options
//     xSelect.innerHTML = '';
//     ySelect.innerHTML = '';

//     features.forEach(f => {
//         const optionX = document.createElement('option');
//         optionX.value = f;
//         optionX.textContent = f;

//         const optionY = document.createElement('option');
//         optionY.value = f;
//         optionY.textContent = f;

//         xSelect.appendChild(optionX);
//         ySelect.appendChild(optionY);
//     });

//     // Set defaults and trigger initial plot
//     xSelect.selectedIndex = 0;
//     ySelect.selectedIndex = 1;
//     xSelect.onchange = renderCurrentClusters;
//     ySelect.onchange = renderCurrentClusters;
// }

// function renderCurrentClusters() {
//     const xFeature = document.getElementById('x-feature').value;
//     const yFeature = document.getElementById('y-feature').value;
//     renderClusters(currentClusters, xFeature, yFeature);
// }

// function renderClusters(clusters, xFeature, yFeature) {
//     const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF63', '#A963FF', '#FF9F40'];

//     const xIndex = featureNames.indexOf(xFeature);
//     const yIndex = featureNames.indexOf(yFeature);

//     const datasets = clusters.map((cluster, idx) => ({
//         label: `Cluster ${idx + 1}`,
//         data: cluster.points.map(p => ({ x: p[xIndex], y: p[yIndex] })),
//         backgroundColor: colors[idx % colors.length]
//     }));

//     const ctx = document.getElementById('clusterChart').getContext('2d');
//     if (window.myChart) window.myChart.destroy();  // Destroy previous chart

//     window.myChart = new Chart(ctx, {
//         type: 'scatter',
//         data: { datasets },
//         options: {
//             plugins: {
//                 title: {
//                     display: true,
//                     text: `${xFeature} vs ${yFeature}`
//                 }
//             },
//             scales: {
//                 x: {
//                     title: { display: true, text: xFeature }
//                 },
//                 y: {
//                     title: { display: true, text: yFeature }
//                 }
//             }
//         }
//     });
// }


let featureNames = [];
let currentClusters = [];

document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append("csv_file", document.getElementById("csv_file").files[0]);

    fetch('/run_kmeans', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        currentClusters = data.clusters;
        featureNames = data.feature_names;
        populateFeatureDropdowns(featureNames);
        renderCurrentClusters();  // Initial chart rendering
    });
});

// Add event listener to switch between clustering and parallel coordinates
document.getElementById("algorithmSelect").addEventListener("change", function(event) {
    const selectedAlgorithm = event.target.value;

    if (selectedAlgorithm === "kmeans") {
        renderCurrentClusters();
    } else if (selectedAlgorithm === "parallelCoordinates") {
        renderParallelCoordinates();
    }
});

function populateFeatureDropdowns(features) {
    const xSelect = document.getElementById('x-feature');
    const ySelect = document.getElementById('y-feature');

    // Clear previous options
    xSelect.innerHTML = '';
    ySelect.innerHTML = '';

    features.forEach(f => {
        const optionX = document.createElement('option');
        optionX.value = f;
        optionX.textContent = f;

        const optionY = document.createElement('option');
        optionY.value = f;
        optionY.textContent = f;

        xSelect.appendChild(optionX);
        ySelect.appendChild(optionY);
    });

    // Set defaults and trigger initial plot
    xSelect.selectedIndex = 0;
    ySelect.selectedIndex = 1;
    xSelect.onchange = renderCurrentClusters;
    ySelect.onchange = renderCurrentClusters;
}

function renderCurrentClusters() {
    const xFeature = document.getElementById('x-feature').value;
    const yFeature = document.getElementById('y-feature').value;
    renderClusters(currentClusters, xFeature, yFeature);
}

function renderClusters(clusters, xFeature, yFeature) {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF63', '#A963FF', '#FF9F40'];

    const xIndex = featureNames.indexOf(xFeature);
    const yIndex = featureNames.indexOf(yFeature);

    const datasets = clusters.map((cluster, idx) => ({
        label: `Cluster ${idx + 1}`,
        data: cluster.points.map(p => ({ x: p[xIndex], y: p[yIndex] })),
        backgroundColor: colors[idx % colors.length]
    }));

    const ctx = document.getElementById('clusterChart').getContext('2d');
    if (window.myChart) window.myChart.destroy();  // Destroy previous chart

    window.myChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `${xFeature} vs ${yFeature}`
                }
            },
            scales: {
                x: {
                    title: { display: true, text: xFeature }
                },
                y: {
                    title: { display: true, text: yFeature }
                }
            }
        }
    });
}

function renderParallelCoordinates() {
    const formData = new FormData();
    formData.append("csv_file", document.getElementById("csv_file").files[0]);

    fetch('/run_parallel_coordinates', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        drawParallelCoordinates(data.data);  // Pass data to parallel coordinates drawing function
    });
}
