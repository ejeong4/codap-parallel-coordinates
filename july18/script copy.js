let rawHeaders = [];
let rawData = [];
let dataset = [];
let selectedFeatures = Array(5).fill(null);
let k = 2;
const maxFeatures = 5;

// document.getElementById('clearCsvBtn').addEventListener('click', () => {
//   document.getElementById('csvUrlInput').value = '';
// });

// Store the current CSV link globally
let currentCsvUrl = "";

function resetState() {
    rawHeaders = [];
    rawData = [];
    dataset = [];
    selectedFeatures = Array(5).fill(null);

    // Clear feature buttons
    const featureButtons = document.getElementById('feature-buttons');
    if (featureButtons) featureButtons.innerHTML = '';

    // Reset drop slots
    document.querySelectorAll('.drop-slot .drop-label').forEach(label => {
        label.textContent = 'Drop here';
    });

    // Clear chart
    d3.select("#parallel-coords").selectAll("*").remove();

    // Clear generated CSV link
    const linkContainer = document.getElementById("generatedLinkContainer");
    if (linkContainer) linkContainer.innerHTML = '';
}


function toggleSection(id) {
    const section = document.getElementById(id);
    const arrow = document.getElementById('arrow-' + id);
    section.classList.toggle('active');
    arrow.classList.toggle('open');
}

function openSection(id) {
    const section = document.getElementById(id);
    const arrow = document.getElementById('arrow-' + id);

    section.classList.add('active');
    section.style.display = 'block';
    arrow.classList.add('open');
}

// document.getElementById('loadCsvBtn').addEventListener('click', () => {
//   const url = document.getElementById('csvUrlInput').value.trim();
//   if (!url) return;

//   resetState(); // clear everything before loading new CSV

//   d3.csv(url)
//     .then(data => {
//       dataset = data;

//       const allHeaders = data.columns || Object.keys(data[0]);

//       // Filter only numeric columns
//       rawHeaders = allHeaders.filter(header =>
//         data.some(row => {
//           const val = row[header];
//           return val !== "" && !isNaN(+val);
//         })
//       );

//       rawData = data.map(row => rawHeaders.map(h => +row[h]));

//       if (document.getElementById('feature-buttons')) {
//         renderFeatureButtons(rawHeaders);
//       }

//     })
//     .catch(err => {
//       console.error(err);
//       alert("Failed to load CSV. Check the URL and CORS settings.");
//     });
// });



function renderFeatureButtons(features) {
    const container = document.getElementById('feature-buttons');
    container.innerHTML = '';

    features.forEach(f => {
        const tag = document.createElement('div');
        tag.className = 'feature-tag';
        tag.textContent = f;
        tag.draggable = true;
        tag.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text/plain", f);
        });
        container.appendChild(tag);
    });

    setupDropTargets();
}

function setupDropTargets() {
    document.querySelectorAll('.drop-slot').forEach(slot => {
        slot.addEventListener('dragover', e => {
            e.preventDefault();
            slot.classList.add('dragover');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('dragover');
        });

        slot.addEventListener('drop', e => {
            e.preventDefault();
            slot.classList.remove('dragover');
            const feature = e.dataTransfer.getData("text/plain");
            const index = parseInt(slot.dataset.index);
            selectedFeatures[index] = feature;
            slot.querySelector('.drop-label').textContent = feature;

            if (selectedFeatures.filter(f => f !== null).length >= 2) {
                drawParallelCoordinates();
            }
        });
    });
}

// function drawParallelCoordinates() {
//   const svg = d3.select("#parallel-coords");
//   svg.selectAll("*").remove();

//   const width = +svg.attr("width");
//   const height = +svg.attr("height");
//   const dimensions = selectedFeatures.filter(f => f !== null);

//   if (dimensions.length < 2) return;

//   const y = {};
//   for (let dim of dimensions) {
//     y[dim] = d3.scaleLinear()
//       .domain(d3.extent(dataset, d => +d[dim]))
//       .range([height - 20, 20]);
//   }

//   const x = d3.scalePoint()
//     .range([20, width - 20])
//     .domain(dimensions);

//     dataset.forEach(d => {
//       svg.append("path")
//         .datum(d)
//         .attr("d", d3.line()(dimensions.map(dim => [x(dim), y[dim](+d[dim])])))
//         .style("fill", "none")
//         .style("stroke", "#177991")
//         .style("stroke-width", 1)
//         .style("opacity", 0.3)
//         .on("mouseover", function() {
//           d3.select(this).style("stroke-width", 2).style("opacity", 1);
//         })
//         .on("mouseout", function() {
//           d3.select(this).style("stroke-width", 1).style("opacity", 0.3);
//         });
//     });


//   svg.selectAll(".dimension")
//     .data(dimensions)
//     .enter().append("g")
//     .attr("transform", d => `translate(${x(d)})`)
//     .each(function(d) {
//       d3.select(this).call(d3.axisLeft(y[d]));
//     })
//     .append("text")
//     .style("text-anchor", "middle")
//     .attr("y", 10)
//     .text(d => d)
//     .style("font-size", "12px")
//     .style("fill", "#6F6F79");
// }
function drawParallelCoordinates() {
    const svg = d3.select("#parallel-coords");
    svg.selectAll("*").remove();

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const dimensions = selectedFeatures.filter(f => f !== null);
    if (dimensions.length < 2) return;

    // Add internal margin
    const margin = { top: 30, right: 30, bottom: 20, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const y = {};
    for (let dim of dimensions) {
        y[dim] = d3.scaleLinear()
            .domain(d3.extent(dataset, d => +d[dim]))
            .range([innerHeight, 0]);
    }

    const x = d3.scalePoint()
        .range([0, innerWidth])
        .domain(dimensions);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    dataset.forEach(d => {
        g.append("path")
            .datum(d)
            .attr("d", d3.line()(dimensions.map(dim => [x(dim), y[dim](+d[dim])])))
            .style("fill", "none")
            .style("stroke", "#177991")
            .style("stroke-width", 1)
            .style("opacity", 0.2)
            .on("mouseover", function() {
                d3.select(this).style("stroke-width", 2).style("opacity", 1);
            })
            .on("mouseout", function() {
                d3.select(this).style("stroke-width", 1).style("opacity", 0.2);
            });
    });

    g.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("transform", d => `translate(${x(d)})`)
        .each(function(d) {
            d3.select(this).call(d3.axisLeft(y[d]));
        })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -10)
        .text(d => d)
        .style("font-size", "12px")
        .style("fill", "#6F6F79");
}


function selectFeature(feature) {
    if (selectedFeatures.includes(feature)) return;
    if (selectedFeatures.length >= maxFeatures) return;

    selectedFeatures.push(feature);
    document.getElementById('feature' + selectedFeatures.length).textContent = feature;

    if (selectedFeatures.length >= 2) drawParallelCoordinates();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cluster-options span').forEach(span => {
        span.onclick = () => {
            k = parseInt(span.dataset.k);
            document.querySelectorAll('.cluster-options span').forEach(s => s.classList.remove('selected'));
            span.classList.add('selected');
        };
    });
});

function kMeans(data, k) {
    const assignments = new Array(data.length);
    const means = [];

    // Initialize random centroids
    for (let i = 0; i < k; i++) {
        means.push(data[Math.floor(Math.random() * data.length)]);
    }

    let changed = true;
    while (changed) {
        changed = false;

        // Assign points
        for (let i = 0; i < data.length; i++) {
            const distances = means.map(m => euclidean(data[i], m));
            const minIndex = distances.indexOf(Math.min(...distances));
            if (assignments[i] !== minIndex) {
                assignments[i] = minIndex;
                changed = true;
            }
        }

        // Move means
        const sums = Array.from({ length: k }, () => Array(data[0].length).fill(0));
        const counts = Array(k).fill(0);
        for (let i = 0; i < data.length; i++) {
            const cluster = assignments[i];
            counts[cluster]++;
            for (let j = 0; j < data[i].length; j++) {
                sums[cluster][j] += data[i][j];
            }
        }

        for (let i = 0; i < k; i++) {
            if (counts[i] === 0) continue;
            for (let j = 0; j < means[i].length; j++) {
                means[i][j] = sums[i][j] / counts[i];
            }
        }
    }

    // Group by cluster
    const clustered = Array.from({ length: k }, () => []);
    for (let i = 0; i < data.length; i++) {
        clustered[assignments[i]].push(data[i]);
    }
    return clustered;
}

function euclidean(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

function summarizeCluster(cluster, headers) {
    return headers.map((h, i) => {
        const values = cluster.map(d => d[i]);
        const avg = d3.mean(values).toFixed(1);
        return `${h}: ${avg}`;
    }).join(" | ");
}


function render() {
    if (!rawData.length) return;
    const clusters = kMeans(rawData, k);

    const container = document.getElementById('charts');
    container.innerHTML = '';

    clusters.forEach((cluster, index) => {
        if (!cluster.length) return;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", 400);
        svg.setAttribute("height", 200);
        svg.classList.add("cluster-svg");
        svg.setAttribute("id", `parallel-coords-${index}`);
        container.appendChild(svg);

        drawParallelCoordinatesD3(`#parallel-coords-${index}`, cluster, rawHeaders);
    });
}

// Update this when CSV is loaded
function handleCsvLoad(data, url) {
    currentCsvUrl = url;

    // Your existing logic
    dataset = data;
    rawHeaders = dataset.columns || Object.keys(data[0]);
    render();
}

function drawParallelCoordinatesD3(svgSelector, dataset, selectedFeatures) {
    const svg = d3.select(svgSelector);
    svg.selectAll("*").remove();

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = { top: 30, right: 30, bottom: 20, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const dimensions = selectedFeatures;
    if (dimensions.length < 2) return;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = {};
    for (let i = 0; i < dimensions.length; i++) {
        y[dimensions[i]] = d3.scaleLinear()
            .domain(d3.extent(dataset, d => d[i]))
            .range([innerHeight, 0]);
    }

    const x = d3.scalePoint()
        .range([0, innerWidth])
        .domain(dimensions);

    dataset.forEach(d => {
        g.append("path")
            .datum(d)
            .attr("d", d3.line()(dimensions.map((dim, i) => [x(dim), y[dim](d[i])])))
            .style("fill", "none")
            .style("stroke", "#177991")
            .style("stroke-width", 1.5)
            .style("opacity", 0.5);
    });

    g.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("transform", d => `translate(${x(d)})`)
        .each(function(d) {
            d3.select(this).call(d3.axisLeft(y[d]));
        })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -10)
        .text(d => d)
        .style("font-size", "12px")
        .style("fill", "#6F6F79");
}

// function downloadSelectedFeatures() {
//   const selected = selectedFeatures.filter(f => f !== null);
//   if (selected.length < 2) {
//     alert("Please select at least two features.");
//     return;
//   }

//   const filteredData = dataset.map(row => {
//     const newRow = {};
//     selected.forEach(f => newRow[f] = row[f]);
//     return newRow;
//   });

//   const csvContent = d3.csvFormat(filteredData);
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.setAttribute("href", url);
//   a.setAttribute("download", "selected_features.csv");
//   a.click();
// }

function createLinkForSelectedFeatures() {
    const selected = selectedFeatures.filter(f => f !== null);
    if (selected.length < 2) {
        alert("Please select at least two features.");
        return;
    }

    const filteredData = dataset.map(row => {
        const newRow = {};
        selected.forEach(f => newRow[f] = row[f]);
        return newRow;
    });

    const csvContent = d3.csvFormat(filteredData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const container = document.getElementById("generatedLinkContainer");
    container.innerHTML = `<a href="${url}" download="selected_features.csv" target="_blank">CSV Link</a>`;
}

document.getElementById("createLinkButton").addEventListener("click", createLinkForSelectedFeatures);

// Handle CSV link drag-and-drop
window.addEventListener('dragover', e => {
    e.preventDefault();
    document.body.classList.add('dragging');
});

window.addEventListener('dragleave', e => {
    document.body.classList.remove('dragging');
});

window.addEventListener('drop', e => {
    e.preventDefault();
    document.body.classList.remove('dragging');

    const url = e.dataTransfer.getData('text/plain').trim();
    if (!url.endsWith('.csv')) {
        return;
    }

    resetState();

    d3.csv(url)
        .then(data => {
            dataset = data;

            const allHeaders = data.columns || Object.keys(data[0]);

            rawHeaders = allHeaders.filter(header =>
                data.some(row => {
                    const val = row[header];
                    return val !== "" && !isNaN(+val);
                })
            );

            rawData = data.map(row => rawHeaders.map(h => +row[h]));

            if (document.getElementById('feature-buttons')) {
                renderFeatureButtons(rawHeaders);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Failed to load CSV. Check the URL and CORS settings.");
        });
});

document.getElementById("drag-wrapper").addEventListener("dragstart", (e) => {
    const selected = selectedFeatures.filter(f => f !== null);
    if (selected.length < 2) {
        alert("Select at least two features.");
        e.preventDefault();
        return;
    }

    const filteredData = dataset.map(row => {
        const newRow = {};
        selected.forEach(f => newRow[f] = row[f]);
        return newRow;
    });

    const csvContent = d3.csvFormat(filteredData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    e.dataTransfer.setData("text/plain", url);
    e.dataTransfer.setData("text/uri-list", url);
});