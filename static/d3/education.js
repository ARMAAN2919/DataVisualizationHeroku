function PlotGraph(year) { // function for slider to change years

    //var year = 2008
    var fileUrl = 'static/datasets/age-when-completed-continuous-full-time-education-' + year + '.csv';
    var divId = '#chart-' + year // use in the div to call that specific year graph
    $(divId).html(''); // to change age

    var margin = { top: 100, right: 50, bottom: 100, left: 50 },
        width = 750 - margin.left - margin.right,
        height = 750 - margin.top - margin.bottom,
        innerRadius = 140,
        outerRadius = Math.min(width, height) / 2;

    var svg = d3.select(divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    d3.csv(fileUrl, function (data) {
        console.log(data)
        var age = $('#age').val(); // age options

        //var yColumn = "16 or under";
        //var yColumn2 = "17-19"

        var yColumn = []; // outer radius values
        var yColumn2 = []; // inner radius values

        if (age == '20') {
            yColumn = ["20-23"];
            yColumn2 = ["24+"];
        }
        else if (age == 'NA') {
            yColumn = ["Still in education"];
            yColumn2 = ["Never had education"];
        }
        else {
            yColumn = ["16 or under"];
            yColumn2 = ["17-19"];
        }
        data = data.map(function (d) {

            // get rid of the commas on values as it won't be shown properly
            d[yColumn] = +d[yColumn].replace(",", "");
            d[yColumn2] = +d[yColumn2].replace(",", "")
            return d;

        });

        data = data.slice(1, 33); // need only boroughs 

        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .domain(data.map(function (d) { return d.Area; }));

        var value1 = data.map(function (d) { return d[yColumn] });

        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius]) // both radius
            .domain([0, d3.max(value1)]);

        var value2 = data.map(function (d) { return d[yColumn2] }); // second value for radius

        var yScale = d3.scaleRadial()
            .range([innerRadius, 5])
            .domain([0, d3.max(value2)]);

        // adding first varibale to radius
        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "#3D155F")
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(function (d) { return y(d[yColumn]); })
                .startAngle(function (d) { return x(d.Area); })
                .endAngle(function (d) { return x(d.Area) + x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(innerRadius))
            .on("mouseover", function () { tooltip.style("display", "null"); })
            //.on("mouseleave", function () { tooltip.style("display", "none"); })
            .on("mousemove", function (d) {
                console.log(d);
                var xPosition = d3.mouse(this)[0] - 5;
                var yPosition = d3.mouse(this)[1] - 5;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d[yColumn]);
                tooltip.style("display", "block");
            })

        svg.on('mouseleave', function (d) {
            tooltip.style('display', 'none');
            //console.log("G mouseout");
        })

        // adding second variable to radius
        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "#DF678C")
            .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                .innerRadius(function (d) { return yScale(0) })
                .outerRadius(function (d) { return yScale(d[yColumn2]); })
                .startAngle(function (d) { return x(d.Area); })
                .endAngle(function (d) { return x(d.Area) + x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(innerRadius))
            .on("mouseover", function () { tooltip.style("display", "null"); })
            //.on("mouseleave", function () { tooltip.style("display", "none"); })
            .on("mousemove", function (d) {
                console.log(d);
                var xPosition = d3.mouse(this)[0] - 5;
                var yPosition = d3.mouse(this)[1] - 5;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d[yColumn2]);
                tooltip.style("display", "block");
            })
        svg.on('mouseleave', function (d) {
            tooltip.style('display', 'none');
            //console.log("G mouseout");
        })

        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("z-index", 1000)
            .style("display", "none")
            .style("opacity", 1);

        // adding the area name of each borough with right dimensions
        svg.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("text-anchor", function (d) { return (x(d.Area) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function (d) {
                return "rotate(" + ((x(d.Area) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d[yColumn]) + 10) + ",0)";
            })
            .append("text")
            .text(function (d) { return (d.Area) })
            .attr("transform", function (d) {
                return (x(d.Area) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)";
            })
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle")

        // simple legend for the values
        svg.append("circle").attr("cx", 210).attr("cy", -350).attr("r", 6).style("fill", "#3D155F")
        svg.append("circle").attr("cx", 210).attr("cy", -330).attr("r", 6).style("fill", "#DF678C")
        svg.append("text").attr("x", 230).attr("y", -350).text([yColumn]).style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("x", 230).attr("y", -330).text([yColumn2]).style("font-size", "15px").attr("alignment-baseline", "middle")

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
}

// year options using slider
window.onload = function () {
    PlotGraph(2008);
    PlotGraph(2009);
    PlotGraph(2010);
    PlotGraph(2011);
    PlotGraph(2012);
    PlotGraph(2013);
    PlotGraph(2014);
    PlotGraph(2015);
    PlotGraph(2016);
    PlotGraph(2017);
    PlotGraph(2018);
    $('.slick-carousel').slick();
    /*({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 500,
      });*/

    // age options using select
    $('#age').change(function () {
        PlotGraph(2008);
        PlotGraph(2009);
        PlotGraph(2010);
        PlotGraph(2011);
        PlotGraph(2012);
        PlotGraph(2013);
        PlotGraph(2014);
        PlotGraph(2015);
        PlotGraph(2016);
        PlotGraph(2017);
        PlotGraph(2018);
    })
};