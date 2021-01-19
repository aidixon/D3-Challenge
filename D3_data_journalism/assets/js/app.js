// Set the variables for height and width
var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 25,
    right: 45,
    bottom: 60,
    left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper to contain the chart using the scatter class
var svg = d3.select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// transform margins so the axis are the correct spot
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data for analysis
d3.csv("../data/data.csv").then(function(povertydata) {

    // First parse the data into numbers
    povertydata.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    })

    // Scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([30, d3.max(povertydata, d => d.healthcare)])
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
});