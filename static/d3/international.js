var margin = { top: 100, right: 100, bottom: 20, left: 100 },
  width = 1000 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*Concept taken from Blocks by Romain Vuillemont, all code has been adapted.
Mainly just the tooltip interaction is the most similar
http://bl.ocks.org/romsson/f205420d21ced66810058d4cdf25c6dd/bde5fc56d3fa8a05852e108e6bffb1aa09734589 */

var parseDate = d3.timeParse("%Y"); // convert year to the correct form

var x = d3.scaleTime()
  .range([0, width]);

var y = d3.scaleLinear()
  .range([height, 0]);

d3.csv("static/datasets/number-of-international-students-at-london-universities.csv", function (data) {
  console.log(data);

  data.forEach(function (d) {
    d.year = parseDate(d.Year)
    d['Number of international students at London universities'] = +d['Number of international students at London universities'] // column needed
    console.log(d.year);
  });

  x.domain(d3.extent(data, function (d) { return d.year; }));
  y.domain([0, d3.max(data, function (d) { return d['Number of international students at London universities']; })]) // takes max value from column value as y domain

  var line = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d['Number of international students at London universities']); });

  var g = svg.append("g")
    .attr("transform", "translate(10, 0)");

  svg.selectAll("text").data(data).enter()
    .append("text")
    .attr("y", 420)
    .attr("x", function (d) { return x(d.year); })
    .attr("id", "") //
    .style("font-size", 10)
    .text(function (d, i) { return d.year; });

  g.selectAll("circle").data(data).enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.year); })
    .attr("cy", function (d) { return y(d['Number of international students at London universities']); })
    .attr("r", function (d, i) { return 5; })
    .attr("id", function (d) { return d.id; })
    .style("fill", "#4831D4")
    .on("mouseover", function (d) { // interactive feature

      d3.select(this).transition().duration(200).style("fill", "#8BD8BD");

      g.selectAll("#tooltipp").data([d]).enter().append("text")
        .attr("id", "tooltipp")
        .text(function (d, i) { return d['Number of international students at London universities']; })
        .attr("y", function (d) { return y(d['Number of international students at London universities']) - 12 })
        .attr("x", function (d) { return x(d.year); })

      g.selectAll("#tooltip_path").data([d]).enter().append("line")
        .attr("id", "tooltip_path")
        .attr("class", "line")
        .attr("d", line)
        .attr("x1", function (d) { return x(d.year) })
        .attr("x2", function (d) { return x(d.year) })
        .attr("y1", height)
        .attr("y2", function (d) { return y(d['Number of international students at London universities']) })
        .attr("stroke", "black")
        .style("stroke-dasharray", ("3, 3"));
    })
    .on("mouseout", function (d) {
      d3.select(this).transition().duration(500).style("fill", "#4831D4");
      g.selectAll("#tooltipp").remove();
      g.selectAll("#tooltip_path").remove();
    });

  g.selectAll("path").data([data]).enter().append("path")
    .attr("class", "line")
    .attr("d", line);

  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
});