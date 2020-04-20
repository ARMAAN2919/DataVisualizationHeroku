function PlotGraph(year, type) { // function for slider to change years and between prim and sec

    var divId = '#chart-' + year // use in the div to call that specific year graph
    var fileUrl = 'static/datasets/pupils-by-first-language-' + year + '.csv'; // to get each individual csv file by year

    // set the dimensions and margins of the graph
    var width = 450
    height = 500
    margin = 40

    // radius of pie chart, equation used from d3 graph gallery
    var radius = Math.min(width, height) / 2 - margin
    $(divId).find('svg').remove();

    // changed and adapted from d3 graph gallery
    var svgOrig = d3.select(divId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    var svg = svgOrig.append('g')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv(fileUrl, function (data) {
        var londonData = []; // only using london row
        var keys = [];
        data.map(function (row) {
            console.log(row)
            if (row.Area == 'London') {
                console.log("London")
                if (type === 'primary') {
                    londonData = {
                        "First Language other than English": row.First_Lang_Other_Eng_Percentage,
                        "First Language is English": row.First_Lang_Eng_Percentage,
                        "Unclassified": row.Unclassified_Percentage
                    }
                    // if want to identify as primary different then change name for keys
                    keys = ["First Language other than English", "First Language is English", "Unclassified"]
                }
                else {
                    londonData = {
                        "First Language other than English": row.First_Lang_Other_Eng_Percentage_Sec,
                        "First Language is English": row.First_Lang_Eng_Percentage_Sec,
                        "Unclassified": row.Unclassified_Percentage_Sec
                    }
                    keys = ["First Language other than English", "First Language is English", "Unclassified"]
                }

            }
        })

        /* set the color (chromatic), used from d3 graph gallery 
        options from https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9*/
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeDark2);

        /* Used concept from d3 graph gallery for pie chart, 
        but data type for buttons are different. Added tooltips, legends and 
        other components to the function https://www.d3-graph-gallery.com/graph/pie_changeData.html */

        // function to update graph when variable changes
        function update(data) {

            var pie = d3.pie()
                .value(function (d) { return d.value; })
                .sort(function (a, b) { console.log(a); return d3.ascending(a.key, b.key); }) // to stay in ascending order

            var finalData = pie(d3.entries(data))

            var g = svg.selectAll("path")
                .data(finalData)


            g
                .enter()
                .append('path')
                .merge(g)
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)
                )
                .attr('fill', function (d) { return (color(d.data.key)) })
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1)
                .on("mousemove", function (d) {
                    console.log("mousemove");
                    tooltip = svg.filter('.tooltip')
                    //html = '<strong>' + d.data.key + '</strong>';
                    html = '<br><br>' + '<div>' + d.value + '%</div>';
                    d3.select("#tooltip")
                        .style("left", (d3.event.pageX + 20) + "px")
                        .style("top", d3.event.pageY + "px")
                        .style("opacity", 1)
                        .html(html);
                })
                .on('mouseleave', function (d) {
                    tooltip.style('display', 'none');
                    //console.log("G mouseout");
                }).transition()
                .duration(1000)
                ;
            /*.on("mouseout", function () {
            // Hide the tooltip
            d3.select("#tooltip")
                .style("opacity", 0);;
        })*/
            /*svg.on('mouseleave', function (d) {
            tooltip.style('display', 'none');
            //console.log("G mouseout");
              })*/

            svg.on('mouseout', function (d) {
                d3.select('#tooltip').style('opacity', 0);
                console.log("G mouseout");
            });

            // create legend for the variables inside the graph
            var legend = svgOrig.append("g")
                .style("font-family", "sans-serif")
                .style("font-size", 10)
                .style("text-anchor", "end")
                .attr('class', 'legend-container')
                .selectAll("g")
                .data(keys.slice().reverse())
                .enter().append("g")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

            // configure the legend
            legend.append("rect")
                .attr("x", width - 10)
                .attr("width", 30)
                .attr("height", 19)
                .attr("fill", function (d) {
                    return (color(d))
                });

            legend.append("text")
                .attr("x", width - 15)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function (d) { return d; });

            g
                .exit()
                .remove()

        }
        update(londonData);
    })
}

// year options using slider
window.onload = function () {
    PlotGraph(2007, "primary");
    PlotGraph(2008, "primary");
    PlotGraph(2009, "primary");
    PlotGraph(2010, "primary");
    PlotGraph(2011, "primary");
    PlotGraph(2012, "primary");
    PlotGraph(2013, "primary");
    PlotGraph(2014, "primary");
    PlotGraph(2015, "primary");
    PlotGraph(2016, "primary");
    PlotGraph(2017, "primary");
    PlotGraph(2018, "primary");
    $('.slick-carousel').slick();
    /*{
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1
  });*/

};