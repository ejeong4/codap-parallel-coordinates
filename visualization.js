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
            .style("fill", "black");
    });

    // Create lines and labels for each row of data
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
            .attr("stroke", "steelblue")
            .attr("fill", "none")
            .attr("opacity", 0.5);

        // Add labels for the rows (optional)
        // line.append("text")
        //     .attr("x", x(dimensions[0]))  // Position at the first axis
        //     .attr("y", yScales[0](+row[dimensions[0]]))
        //     .attr("dy", -5)  // Adjust this to space the label from the line
        //     .attr("text-anchor", "middle")
        //     .text(rowIndex)  // Using row index as label (could be any row value)
        //     .style("font-size", "10px")
        //     .style("fill", "black");

        // Add hover interaction (mouseover/mouseout)
        path.on("mouseover", function(event, d) {
            // Highlight the line
            d3.select(this).attr("stroke", "red").attr("stroke-width", 2);
        })
        .on("mouseout", function(event, d) {
            // Reset line color
            d3.select(this).attr("stroke", "steelblue").attr("stroke-width", 1);
        });
    });
}
