function drawParallelCoordinates(data) {
    d3.select("#chart").selectAll("*").remove();  // Clear previous charts

    let dimensions = Object.keys(data[0]);
    let svg = d3.select("#chart").append("svg")
        .attr("width", 600).attr("height", 400);

    let x = d3.scalePoint().domain(dimensions).range([50, 550]);

    // Create y scales for each dimension
    let yScales = dimensions.map(dim => {
        return d3.scaleLinear()
            .domain(d3.extent(data, d => +d[dim]))
            .range([350, 50]);
    });

    // Create axes and labels for each dimension
    dimensions.forEach((dim, i) => {
        let scale = yScales[i];

        // Create axis
        svg.append("g")
            .attr("transform", `translate(${x(dim)},0)`)
            .call(d3.axisLeft(scale));

        // Add axis labels
        svg.append("text")
            .attr("x", x(dim))
            .attr("y", 30)  // Adjust this value to position the label
            .attr("text-anchor", "middle")
            .text(dim)
            .style("font-size", "12px")
            .style("fill", "#6F6F79");
    });

    // Create lines for each row of data
    data.forEach((row, rowIndex) => {
        let line = svg.append("g");  // Group to handle both line and label

        // Create a line for each row of data
        let path = line.append("path")
            .data([row])
            .attr("d", d3.line()(
                dimensions.map((dim, i) => {
                    return [x(dim), yScales[i](+row[dim])];
                })
            ))
            .attr("stroke", "#177991")
            .attr("fill", "none")
            .attr("opacity", 0.5);

        // Add hover interaction
        path.on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "red").attr("stroke-width", 2);
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("stroke", "#177991").attr("stroke-width", 1);
        });
    });
}
