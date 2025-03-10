// Dimensions and margins
const margin = { top: 30, right: 50, bottom: 30, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#parallel-coords")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let dimensions, yScales, xScale, line;

// Function to draw parallel coordinates
function drawParallelCoordinates(data) {
    // Extract numerical dimensions
    dimensions = Object.keys(data[0]).filter(d => typeof data[0][d] === "number");

    // Define yScales for each dimension
    yScales = {};
    dimensions.forEach(dim => {
        yScales[dim] = d3.scaleLinear()
            .domain(d3.extent(data, d => d[dim]))
            .range([height, 0]);
    });

    // Define xScale to distribute dimensions
    xScale = d3.scalePoint()
        .domain(dimensions)
        .range([0, width]);

    // Define line generator
    line = d3.line()
        .defined(d => d)  // Ignore missing values
        .x((d, i) => xScale(dimensions[i]))
        .y((d, i) => yScales[dimensions[i]](d));

    // Draw lines for each data point
    svg.selectAll(".line").data(data).enter()
        .append("path")
        .attr("class", "line")
        .attr("d", d => line(dimensions.map(dim => d[dim])))
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("opacity", 0.5);

    // Draw axes
    svg.selectAll(".axis").data(dimensions).enter()
        .append("g")
        .attr("class", "axis")
        .attr("transform", d => `translate(${xScale(d)},0)`)
        .each(function (d) {
            d3.select(this).call(d3.axisLeft(yScales[d]));
        })
        .append("text")
        .attr("class", "axis-label")
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text(d => d);
}

// Example data
const sampleData = [
    { A: 10, B: 20, C: 30 },
    { A: 15, B: 25, C: 35 },
    { A: 20, B: 30, C: 40 }
];

// Draw initial visualization
drawParallelCoordinates(sampleData);

async function loadDataFromCODAP() {
    let data = await codapInterface.getData("your_dataset_name");
    drawParallelCoordinates(data);
}

// Fetch and update visualization when loaded
loadDataFromCODAP();

