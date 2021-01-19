// Set the variables for height and width
var svgWidth = 2500;
var svgHeight = 875;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper to contain the chart using the scatter class
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// transform margins so the axis are the correct spot
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data for analysis
d3.csv("assets/data/data.csv").then(function(povertydata) {
    console.log(povertydata);

    // First parse the data into numbers
    povertydata.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    })

    // Scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.max(povertydata, d => d.healthcare) - 2, 8])
        .range([height, 0]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(povertydata, d => d.poverty)])
        .range([height, 0]);
    // Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the axes to the chart 
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Create circle for chart
    var circlesGroup = chartGroup.selectAll("circle")
    .data(povertydata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy",  d => yLinearScale(d.healthcare))
    .attr("r", "20")
    .attr("fill", "blue")
    .attr("opacity", ".6");

    
    // Initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "toolTip")
        .offset([100, -60])
        .html(function(d) {
            return (`<strong>${d.state}<br> Poverty: ${d.poverty}% <br> Healthcare: ${d.healthcare}%</strong>`);
        });

    // Add tooltips to the chart
    chartGroup.call(toolTip);

    // Event listeners that display and hide tooltip
    // On mouseover event
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

    // On mouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        })

    // Labels for the axes
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        // Centers x axis label
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width/5}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
}).catch(function(error) {
    console.log(error)

    // Add labels to the circles
    // svg.selectAll("circle")
    //     .data(povertydata)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", (d,i) => d[1])
    //     .attr("cy", (d,i) => h-d[1])
    //     .attr("r", 5)

    // svg.selectAll("text")
    //     .data(povertydata)
    //     .enter()
    //     .append("text")
    //     .attr("x", (item) => {
    //         return item[1]
    //     })
    //     .attr("y", (item) => {
    //         h - item[1]
    //     })
    //     .text((item) => {
    //         item[1]
    //     })
});
