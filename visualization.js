function drawParallelCoordinates(data) {
    d3.select("#chart").selectAll("*").remove();  // Clear previous charts

    let dimensions = Object.keys(data[0]);
    let svg = d3.select("#chart").append("svg")
        .attr("width", 600).attr("height", 400);

    let x = d3.scalePoint().domain(dimensions).range([50, 550]);

    dimensions.forEach((dim, i) => {
        let scale = d3.scaleLinear()
            .domain(d3.extent(data, d => +d[dim]))
            .range([350, 50]);

        svg.append("g")
            .attr("transform", `translate(${x(dim)},0)`)
            .call(d3.axisLeft(scale));

        data.forEach(row => {
            svg.append("line")
                .attr("x1", x(dim))
                .attr("y1", scale(+row[dim]))
                .attr("x2", x(dimensions[i + 1]) || x(dim))
                .attr("y2", scale(+row[dimensions[i + 1]]) || scale(+row[dim]))
                .attr("stroke", "steelblue")
                .attr("opacity", 0.5);
        });
    });
}
