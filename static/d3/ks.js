function PlotGraph(year, type) { // function for slider to change years and change the boroughs

  //var year = 2016
  var ks = $('#ks').val();
  var fileUrl = ''; // assign path of csv this way because data is in two separate csv files, only way to work with options
  if (ks == 'ks1') {
    fileUrl = 'static/datasets/ks1-results-' + year + '.csv';
  }
  else {
    fileUrl = 'static/datasets/ks2-results-' + year + '.csv';
  };
  // var fileUrl = 'static/datasets/ks1-results-' + year + '.csv';
  var divId = '#chart-' + year // use in the div to call that specific year graph
  $(divId).html(''); // for the stages options to change graph instead of adding it underneath the current one

  var margin = { top: 20, right: 100, bottom: 125, left: 60 },
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  // first thing to declare in a graph, represents the box containing the graph
  var svg = d3.select(divId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var y = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  // for each variable (bar) x0,x1,x2,x3
  // takes care of the positioning the bars on the x and y axis
  var x0 = d3.scaleBand() // set domain later
    .range([0, width], .2);

  var x1 = d3.scaleBand()
    .range([0, width], .2);

  var x2 = d3.scaleBand()
    .range([0, width], .2);

  var x3 = d3.scaleBand()
    .range([0, width], .2);

  // line of the graph
  var xAxis = d3.axisBottom()
    .scale(x0)
    .tickSize(0)

  var yAxis = d3.axisLeft()
    .scale(y)

  // for legend to have same colors as the bar graph
  var z = d3.scaleOrdinal()
    .range(["#E84A5F", "#FF847C", "#FECEA8", "#99B898"]);


  // everything else should be inside this function 
  d3.csv(fileUrl, function (data) {
    console.log(data);
    //var data = {};
    if (type === 'first16') {
      data = data.slice(1, 16);
    }
    else {
      data = data.slice(17, 33);
    }

    // data = data.slice(1, 16);

    /*var borough = $('#borough').val();
    if (borough == 'Last16') {
      data = data.slice(17, 33); //last 16 
    }
    else  {
      data = data.slice(1, 16); //just to show first 16 
    };*/

    /*var data1 = data.slice(1, 16); //last 16 
    var data2 = data.slice(17, 33); //just to show first 16 
  
    var borough = $('#borough').val();
    if (borough == 'First16') {
      data = data1 
    }
    else {
      data = data2
    };*/

    x0.domain(data.map(function (d) { return d.Area })); //set the range of the data in the x axis
    x1.domain(data.map(function (d) { return d.Area }));
    x2.domain(data.map(function (d) { return d.Area }));
    x3.domain(data.map(function (d) { return d.Area }));
    y.domain([0, d3.max(data, function (d) { return d3.max([d['%PassReading-All'], d['%PassWriting-All'], d['%PassMathematics-All'], d['%PassScience-All']]); })]) // takes max value possible as y domain
    z.domain(['%PassReading-All', '%PassWriting-All', '%PassMathematics-All', '%PassScience-All']); // columns that are going to be used
    keys = ['%PassReading', '%PassWriting', '%PassMathematics', '%PassScience']


    // not inputing data this way anymore
    /* dataJson = [];
    year = 2016;
    
    data.map(function(d) {
      var rowData = {
          area: d.Area,
          values: [
            {
              "value": d['%_Pass_Reading'],
              'label': '%_Pass_Reading'
            },
            {
              "value": d['%_Pass_Writing'],
              'label': '%_Pass_Writing'
            },
            {
              "value": d['%_Pass_Mathematics'],
              'label': '%_Pass_Mathematics'
            },
            {
              "value": d['%_Pass_Science'],
              'label': '%_Pass_Science'
            }
          ]
      }
      if (d.Year === '2016') {
            dataJson.push(rowData);
      }
    
    }); */

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll('text')
      .attr('dx', '6em')
      .attr('dy', '-0em')
      .attr('transform', 'rotate(90)');

    svg.append("g")
      .attr("class", "y axis")
      .style('opacity', '1')
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight', 'bold')
      .text("Value");

    // first bar
    svg.selectAll(".bar.reading")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x0(d.Area);
      })
      .attr("fill", "#99B898")
      .attr("width", "15px")
      .attr("y", function (d) { return y(d['%PassReading-All']); })
      .attr("height", function (d) { return height - y(d['%PassReading-All']); })
      .on("mouseover", function () { tooltip.style("display", "null"); })
      // .on("mouseleave", function () { tooltip.style("display", "none"); })
      .on("mousemove", function (d) {
        console.log(d);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d['%PassReading-All']);
        tooltip.style("display", "block");
      });

    svg.on('mouseleave', function (d) {
      tooltip.style('display', 'none');
      //console.log("G mouseout");
    });

    // second bar
    svg.selectAll(".bar.writing")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x0(d.Area) + 15; // as each bar width is 15px, keep doing for rest
      })
      .attr("fill", "#FECEA8")
      .attr("width", "15px")
      .attr("y", function (d) { return y(d['%PassWriting-All']); })
      .attr("height", function (d) { return height - y(d['%PassWriting-All']); })
      .on("mouseover", function () { tooltip.style("display", "null"); })
      // .on("mouseleave", function () { tooltip.style("display", "none"); })
      .on("mousemove", function (d) {
        console.log(d);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d['%PassWriting-All']);
        tooltip.style("display", "block");
      });

    svg.on('mouseleave', function (d) {
      tooltip.style('display', 'none');
      //console.log("G mouseout");
    });

    // third bar
    svg.selectAll(".bar.mathematics")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x0(d.Area) + 30;
      })
      .attr("fill", "#FF847C")
      .attr("width", "15px")
      .attr("y", function (d) { return y(d['%PassMathematics-All']); })
      .attr("height", function (d) { return height - y(d['%PassMathematics-All']); })
      .on("mouseover", function () { tooltip.style("display", "null"); })
      // .on("mouseleave", function () { tooltip.style("display", "none"); })
      .on("mousemove", function (d) {
        console.log(d);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d['%PassMathematics-All']);
        tooltip.style("display", "block");
      });

    svg.on('mouseleave', function (d) {
      tooltip.style('display', 'none');
      //console.log("G mouseout");
    });

    // fourth bar
    svg.selectAll(".bar.science")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x0(d.Area) + 45;
      })
      .attr("fill", "#E84A5F")
      .attr("width", "15px")
      .attr("y", function (d) { return y(d['%PassScience-All']); })
      .attr("height", function (d) { return height - y(d['%PassScience-All']); })
      .on("mouseover", function () { tooltip.style("display", "null"); })
      // .on("mouseleave", function () { tooltip.style("display", "none"); })
      .on("mousemove", function (d) {
        console.log(d);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d['%PassScience-All']);
        tooltip.style("display", "block");
      });

    svg.on('mouseleave', function (d) {
      tooltip.style('display', 'none');
      //console.log("G mouseout");
    });

    // tooltip to hover and see the values of the points  
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none")
      .style("opacity", 1);

    // axis labels
    svg.append('text')
      .attr('x', -220)
      .attr('y', -35)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Percentage (%)')

    svg.append('text')
      .attr('x', 537)
      .attr('y', 420)
      .attr('text-anchor', 'middle')
      .text('Area')

    tooltip.append("rect")
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 30)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");


    // create legend 
    var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    // configure the legend
    legend.append("rect")
      .attr("x", width + 85)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width + 80)
      .attr("y", 10)
      .attr("dy", "0.32em")
      .text(function (d) { return d; });

  })
}

// year options using slider
window.onload = function () {
  PlotGraph(2016, "first16");
  PlotGraph(2017, "first16");
  PlotGraph(2018, "first16");
  $('.slick-carousel').slick();

  // ks options using select
  $('#ks').change(function () {
    PlotGraph(2016, "first16");
    PlotGraph(2017, "first16");
    PlotGraph(2018, "first16");
  })

};
