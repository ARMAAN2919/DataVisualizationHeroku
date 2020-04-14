function PlotGraph(year) { // function for slider to change years

  var fileUrl = 'static/datasets/gcse-results-' + year + '.csv'; // to get each individual csv file by year
  var divId = '#chart-' + year // use in the div to call that specific year graph
  $(divId).html(''); // for the gender options to change graph instead of adding it underneath the current one

  // setitng the dimensions and margins 
  var margin = { top: 0, right: 30, bottom: 100, left: 50 }, // big bottom margin to fit the area name
    width = 860 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // put the svg on to the page
  var svg = d3.select(divId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  var g = svg.append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // fetching data
  d3.csv(fileUrl, function (data) {
    console.log(data);
    // var year = []; // to select options for year
    var gender = $('#gender').val(); // options for gender
    var keys = []; // columns that will be shown for the y-axis data
    // var scatterKey = [];

    // for gender options switching, to call the right column.
    if (gender == 'Male') {
      keys = ['Percentage of pupils entered for components-M', 'Percentage of pupils who achieved a standard 9-4 pass-M'];
    }
    else if (gender == 'Female') {
      keys = ['Percentage of pupils entered for components-F', 'Percentage of pupils who achieved a standard 9-4 pass-F'];
    } else {
      keys = ['Percentage of pupils entered for components-All', 'Percentage of pupils who achieved a standard 9-4 pass-All'];
    };

    // for scatter plot on the bar graph to switch accordingly as well
    var scatterKey = [];
    if (gender == 'Male') {
      scatterKey = ['Average Attainment 8 score per pupil-M'];
    }
    else if (gender == 'Female') {
      scatterKey = ['Average Attainment 8 score per pupil-F'];
    } else {
      scatterKey = ['Average Attainment 8 score per pupil-All'];
    }

    data = data.map(function (d) {

      /* if (gender.indexOf(d.gender) == 0) {
        gender.push(d.gender);
      }*/

      // go through all elements
      for (i = 0, total = 0; i < keys.length; i++) {
        d[keys[i]] = parseInt(d[keys[i]])
        total += d[keys[i]];
      }
      d.total = total;
      return d;
    });

    // var filteredboroughdata = consdata.filter(function(d){ }) //filter rows that want?
    /* var genderOptions = d3.select("#gender").selectAll("option") //select option check if works
        .data(gender)
      .enter().append("option")
        .text(d => d)*/

    // trying to filter the rows that are needed    
    /* var targetBorough = ['Barking and Dagenham', 
      'Barnet',
      'Bexley',
      'Brent',
      'Bromley',
      'Camden',
      'Croydon',
      'Ealing',
      'Enfield',
      'Greenwich',
      'Hackney',
      'Hammersmith and Fulham',
      'Haringey',
      'Harrow',
      'Havering',
      'Hillingdon',
      'Hounslow',
      'Islington',
      'Kensington and Chelsea',
      'Kingston upon Thames',
      'Lambeth',
      'Lewisham',
      'Merton',
      'Newham',
      'Redbridge',
      'Richmond upon Thames',
      'Southwark',
      'Sutton',
      'Tower Hamlets',
      'Waltham Forest',
      'Wandsworth',
      'Westminster'];
    var newData = data.filter(filterCriteria);
    
    function filterCriteria(d) {
      return d.Area === targetBorough;
    } */

    // x axis
    var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1)

    // y axis
    var y = d3.scaleLinear()
      .rangeRound([height, 53]);

    // color of information that will be displayed inside the graph, used for the legend as well
    var z = d3.scaleOrdinal()
      .range(["#CEEAE6", "#291B4F", "#000"]);

    // tooltip to hover and see the values of the points  
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none")
      .style("opacity", 1);

    data = data.slice(1, 33); // just to show boroughs (rows) needed (new way to filter instead)

    // putting and setting ranges for al the information
    x.domain(data.map(function (d) { return d.Area }));
    y.domain([0, d3.max(data, function (d) { return d.total; })])
    z.domain(keys);
    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data)) // stack the data on top of each other
      .enter().append("g")
      .attr("fill", function (d) { return z(d.key); })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("x", function (d) { return x(d.data.Area); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      .on("mouseover", function () { tooltip.style("display", "null"); }) // tooltip to hover over the percentage
      // .on("mouseleave", function () { tooltip.style("display", "none"); })
      .on("mousemove", function (d) {
        console.log(d);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d[1] - d[0]);
        tooltip.style("display", "block");
      })
    svg.on('mouseleave', function (d) {
      tooltip.style('display', 'none');
      //console.log("G mouseout");
    })

    // other interactions to try  
    /*.on('mouseenter', function(actual, i) {
      d3.selectAll('.total')
        .attr('opacity', 0)
  
      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (d) => x(d.Area) - 5)
        .attr('width', x.bandwidth() + 10) */

    // const y = yScale(actual.value)
    // var yLine = y(actual.value)

    // adjust axis so that the the area% fits nicely in scale of the graph
    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('dx', '6em')
      .attr('dy', '-0em')
      .attr('transform', 'rotate(90)');

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

    // add scatter plot of avg attainment score on to the stacked bar graph  
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function (d) { return x(d.Area) + 60; })
      .attr("cy", function (d) { // to be able to use the gender options
        return y(d[scatterKey])
        /*if (gender == 'Male') {
          return y(d['Average Attainment 8 score per pupil-M']);
        }
        else if (gender == 'Female') {
          return y(d['Average Attainment 8 score per pupil-F']);
        } else {
          return y(d['Average Attainment 8 score per pupil-All']);
        }*/
      })
      .on("mouseover", function () { tooltip.style("display", "null"); })
      .on("mouseleave", function () { tooltip.style("display", "none"); })
      .on("mousemove", function (d) {
        console.log(d);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d[scatterKey]
          /*['Average Attainment 8 score per pupil-All']*/); //TODO: tooltip only for all right now
        tooltip.style("display", "block");
      })
      .style("fill", function (d) { return '#000' });
    /*svg.on('mouseleave', function (d) {
      tooltip.style('display', 'none');
      //console.log("G mouseout");
    })*/

    // push it to the legend
    keys.push('Average Attainment 8 score per pupil');
    z.domain(keys);

    // create legend for the variables inside the graph
    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    // configure the legend
    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) { return d; });

    // configure the tooltip 
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
  })

  // axis labels
  svg.append('text')
    .attr('x', -320)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Percentage (%)')

  svg.append('text')
    .attr('x', 420)
    .attr('y', 700)
    .attr('text-anchor', 'middle')
    .text('Area')

}

// year options using slider
window.onload = function () {
  PlotGraph(2015);
  PlotGraph(2016);
  PlotGraph(2017);
  $('.slick-carousel').slick();
  /*{
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1
});*/

  // gender options 
  $('#gender').change(function () {
    PlotGraph(2015);
    PlotGraph(2016);
    PlotGraph(2017);
  })

};