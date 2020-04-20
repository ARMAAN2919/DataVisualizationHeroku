function PlotGraph(rowData) { // function for changing area using option

  $("#q_working_age").html(''); // for area options to change graph instead of adding it underneath the current one

  var width = 500
  height = 500
  margin = 40

  // equation used from d3 graph gallery
  var radius = Math.min(width, height) / 2 - margin

  var svg = d3.select("#q_working_age")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var keys = ["2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"] // the year columns to be shown in the pie chart
  data = {}; // data will be called from outside the function
  keys.map(key => {
    data[key] = rowData[parseInt(key)]; // parse it as integers
  })

  /* used from firstlang.js pie chart */
  
  var color = d3.scaleOrdinal()
    .domain(data)
    .range(d3.schemeCategory10);

  var pie = d3.pie()
    .value(function (d) { return d.value; })

  var finalData = pie(d3.entries(data))

/* concept from d3 graph gallery, lines 39-84.
Tooltips, and some adaptions have been added https://www.d3-graph-gallery.com/graph/pie_annotation.html */

  // to build the arc
  var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

  svg
    .selectAll('slices')
    .data(finalData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function (d) { return (color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    .on("mousemove", function (d) {
      console.log("Mousemove");
      tooltip = svg.filter('.tooltip')
      //html = '<strong>' + d.data.key + '</strong>';
      html = '<br><br>' + '<div>' + d.value + '%</div>';
      d3.select("#tooltip")
        .style("left", (d3.event.pageX + 20) + "px")
        .style("top", (d3.event.pageY + 0) + "px")
        .style("opacity", 1)
        .html(html);
    }).transition()
    .duration(1000)
    ;
  /*.on("mouseout", function () {
  // Hide the tooltip
  d3.select("#tooltip")
      .style("opacity", 0);;
})*/
  svg.on('mouseout', function (d) {
    d3.select('#tooltip').style('opacity', 0);
    console.log("G mouseout");
  });

  svg
    .selectAll('slices')
    .data(finalData)
    .enter()
    .append('text')
    .text(function (d) { return d.data.key })
    .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
    .style("text-anchor", "middle")
    .style("font-size", 11)

}

var dataRows = {}; //to call the area

d3.csv("static/datasets/Qualifications-of-working-age-NVQ-AllAge.csv", function (data) { // load data outside function to incorporate with area options

  var invalidAreas = ["City of London", "North East", "North West", "Yorkshire and The Humber",
    "East Midlands", "West Midlands", "East", "South East", "South West", "England and Wales", "Northern Ireland",
    "Scotland", "Wales", "Great Britain"]; // rows (boroughs) that dont want an option for

  var firstGraph = null;

  data.map(function (row) {
    if (invalidAreas.indexOf(row.Area) > -1) {
      return;
    }
    if (firstGraph == null)
      firstGraph = row;
    dataRows[row.Area] = row;
    $('#area').append('<option value="' + row.Area + '">' + row.Area + '</option>'); // to skip city of london as first graph and start with Barking

  })
  $('#area').change(function () {
    var area = $('#area').val();
    PlotGraph(dataRows[area]); // to plot graph from just area, adapted from learning about functions and options throughout the project
  })
  PlotGraph(firstGraph);
})



