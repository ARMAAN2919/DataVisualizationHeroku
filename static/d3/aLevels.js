function PlotGraph(year) { // function to change years 

    // var year = 2005;
    var fileUrl = 'static/datasets/a-level-results-by-location-of-pupil-residence-' + year + '.csv'; // to get each individual csv file by year
    var divId = '#chart-' + year // each year has its own div
    var yColumn = 'Average Level 3 QCDA Point Score Per Entry; All Students'; // value to be shown when hovering geo graph

    // to load data and geoJson file for the map
    queue()
        .defer(d3.csv, fileUrl)
        .defer(d3.json, "static/datasets/boroughsGeo.json") // sourced file into project
        .await(createGeo); // to put data into the creation function

    function createGeo(error, alevelCsv, geoJson) {

        alevelCsv.forEach(function (d) {
            d.Area = String(d.Area);
            d[yColumn] = +d[yColumn];

        });

        var alevels = crossfilter(alevelCsv);

        aLevelGeoMap(alevels, geoJson, alevelCsv);
        //horizontalGraph();
        dc.renderAll();

    }
    function aLevelGeoMap(alevels, geoJson, alevelCsv) {
        var areaDimension = alevels.dimension(dc.pluck("Area")); // dimension for the borough
        var aLevelsCount = areaDimension.group().reduceSum(dc.pluck(yColumn));
        var center = d3.geo.centroid(geoJson); // setting geoJson map
        var projection = d3.geo.mercator() // mercator lib for UK map (drawing the map)
            .center(center)
            .scale(15000)
            .translate([150, 105]);

        var alevelmap = dc.geoChoroplethChart(divId); // geo class

        alevelmap
            .width(350)
            .height(200)
            .dimension(areaDimension)
            .group(aLevelsCount)
            .useViewBoxResizing(true)
            .title(function (d) {
                return `Average Level 3 QCDA Point Score Per Entry for All Students in ${d.key} is ${d3.format(",")(d.value)}`; // Hovering text to show the avg QCDA value
            })
            .colors(d3.scale.quantize().range(colorbrewer.Purples[9]).domain([150, 230])) // value domain to set for the scale
            .projection(projection)
            .overlayGeoJson(geoJson.features, "area", function (d) {
                return d.properties.LAD13NM; // area code 
            })
            .on('renderlet', function (map) {
                map.selectAll('path').on('click', function (d) {
                    console.log(d);
                    var areaRow = d.properties.LAD13NM; // setting each area to the code
                    var actualRow; // to set the rows needed from the csv file
                    alevelCsv.forEach(function (d) {
                        if (d.Area == areaRow) {
                            actualRow = d;
                        }
                    })
                    var additionalData = [{ // columns from data to show in horizontal barchart graph, values divded by 10 to fit scale and window
                        "name": "Total 16-18 Students who Entered for Level 3 (x10)",
                        "value": actualRow['16-18 Year Old Students Entered for Level 3 Qualifications; Total'].replace(",", "") / 10
                    },
                    {
                        "name": "Average Level 3 QCDA Point Score Per Student (x10)",
                        "value": actualRow['Average Level 3 QCDA Point Score Per Student'] / 10
                    },
                    {
                        "name": "Total Male 16-18 Students who Entered for Level 3 (x10)",
                        "value": actualRow['16-18 Year Old Students Entered for Level 3 Qualifications; Male'].replace(",", "") / 10
                    },
                    {
                        "name": "Average Level 3 QCDA Point Score Per Male Student (x10)",
                        "value": actualRow['Average Level 3 QCDA Point Score Per Male Student'] / 10
                    },
                    {
                        "name": "Average Level 3 QCDA Point Score Per Entry - Male (x10)",
                        "value": actualRow['Average Level 3 QCDA Point Score Per Entry; Male Students'] / 10
                    },
                    {
                        "name": "Total Female 16-18 Students who Entered for Level 3 (x10)",
                        "value": actualRow['16-18 Year Old Students Entered for Level 3 Qualifications; Female'].replace(",", "") / 10
                    },
                    {
                        "name": "Average Level 3 QCDA Point Score Per Female Student (x10)",
                        "value": actualRow['Average Level 3 QCDA Point Score Per Female Student'] / 10
                    },
                    {
                        "name": "Average Level 3 QCDA Point Score Per Entry - Female (x10)",
                        "value": actualRow['Average Level 3 QCDA Point Score Per Entry; Female Students'] / 10
                    },
                    {
                        "name": "Male Students Achieving 2 or More Passes of A Level (x10)",
                        "value": actualRow['Male Students Achieving 2 or More Passes of A Level Equivalent Size'] / 10
                    },
                    {
                        "name": "Female Students Achieving 2 or More Passes of A Level (x10)",
                        "value": actualRow['Female Students Achieving 2 or More Passes of A Level Equivalent Size'] / 10
                    },
                    {
                        "name": "All Students Achieving 2 or More Passes of A Level (x10)",
                        "value": actualRow['Students Achieving 2 or More Passes of A Level Equivalent Size'] / 10
                    }]
                    horizontalGraph(additionalData); // calling the function 
                })
            })
        // for legend
        alevelmap.on("pretransition", function (chart) {
            var colorList = colorbrewer.Purples[9];
            var width = 10;
            var height = 170;

            var svg = chart.select("svg");

            var grad = svg.append("defs")
                .append("linearGradient")
                .attr("id", "gradient-" + year)
                .attr("x1", "0%")
                .attr("x2", "0%")
                .attr("y1", "100%")
                .attr("y2", "0%");

            grad.selectAll("stop")
                .data(colorList)
                .enter()
                .append("stop")
                .attr("offset", function (d, i) {
                    return (i / colorList.length) * 100 + "%";
                })
                .attr("stop-color", function (d) {
                    return d;
                });

            // for object
            var margin = {
                left: 280,
                right: 0,
                top: 25,
                bottom: 0
            };

            var legend = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var gradientDiv = '#gradient-' + year;
            legend.append("rect")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "url(" + gradientDiv + ")");

            var y = d3.scale.linear()
                .domain([230, 150])
                .range([0, height]);

            var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(10)
                .innerTickSize(4)
                .orient("right");
            legend.append("g")
                .attr("class", "axis y")
                .attr("transform", "translate(10, 0)")
                .call(yAxis);
        });
    }
    // addtional graph below to display more data 
    function horizontalGraph(data) {
        // testing with dummy data
        /*var data = [{ 
            "name": "Apples",
            "value": 20,
        },
        {
            "name": "Bananas",
            "value": 12,
        },
        {
            "name": "Grapes",
            "value": 19,
        },
        {
            "name": "Lemons",
            "value": 5,
        },
        {
            "name": "Limes",
            "value": 16,
        },
        {
            "name": "Oranges",
            "value": 26,
        },
        {
            "name": "Pears",
            "value": 30,
        }]; */

        // sorting barchart based on ascending value
        data = data.sort(function (a, b) {
            return d3.ascending(a.value, b.value);
        })

        var margin = {
            top: 15,
            right: 200,
            bottom: 15,
            left: 450,
        };

        var width = 1200 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        d3.select('#additionaldata').html(''); // new div id
        var svg = d3.select("#additionaldata").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1)
            .domain(data.map(function (d) {
                return d.name;
            }));

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0)
            .orient("left");

        var graphY = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var barchart = svg.selectAll(".barchart") // calling style class
            .data(data)
            .enter()
            .append("g")

        // create the barchart, calling name and value from addtional data
        barchart.append("rect")
            .attr("class", "barchart")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            });

        // setting the scale of the texts 
        barchart.append("text")
            .attr("class", "label")
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            .attr("x", function (d) {
                return x(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
            })
    }
};

// plottging graph per year function here
window.onload = function () {
    //PlotGraph(2004);
    PlotGraph(2005);
    PlotGraph(2006);
    PlotGraph(2007);
    PlotGraph(2008);
    PlotGraph(2009);
    PlotGraph(2010);
    PlotGraph(2011);
    PlotGraph(2012);
    PlotGraph(2013);
};