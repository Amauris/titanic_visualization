format = d3.time.format("%d-%m-%Y (%H:%M h)");

function draw(data) {

    /*
    D3.js setup code
    */

    "use strict";
    var margin = 75,
        width = 1400 - margin,
        height = 600 - margin;

    var radius = 3,
        multiplier = 2;

    d3.select("body")
        .append("h2")
        .text("World Cup Attendance");

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'chart');

    /*
    Dimple.js Chart construction code
    */

    d3.select('svg')
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")

    var time_extent = d3.extent(data, function(d) {
        return d['date'];
    });

    var time_scale = d3.time.scale()
        .range([margin, width])
        .domain(time_extent);

    var count_extent = d3.extent(data, function(d) {
        return d['attendance'];
    });

    var count_scale = d3.scale.linear()
        .range([height, margin])
        .domain(count_extent);

    var time_axis = d3.svg.axis()
        .scale(time_scale)
        .ticks(d3.time.years, 2);

    d3.select("svg")
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', "translate(0," + height + ")")
        .call(time_axis);

    var count_axis = d3.svg.axis()
        .scale(count_scale)
        .orient("left");

    d3.select("svg")
        .append('g')
        .attr('class', 'y axis')
        .attr('transform', "translate(" + margin + ",0)")
        .call(count_axis);

    d3.selectAll('circle')
        .attr('cx', function(d) {
            return time_scale(d['date']);
        })
        .attr('cy', function(d) {
            return count_scale(d['attendance']);
        })
        .attr('r', function(d) {
            if (d['home'] === d['team1'] || d['home'] === d['team2']) {
                return radius * multiplier;
            } else {
                return radius;
            }
        })
        .attr('fill', function(d) {
            if (d['home'] === d['team1'] || d['home'] === d['team2']) {
                return 'red'
            } else {
                return 'blue';
            }
        });

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
        .selectAll("g")
        .data(["Home Team", "Others"])
        .enter().append("g");

    legend.append("circle")
        .attr("cy", function(d, i) {
            return i * 30;
        })
        .attr("r", function(d) {
            if (d == "Home Team") {
                return radius * multiplier;
            } else {
                return radius;
            }
        })
        .attr("fill", function(d) {
            if (d == "Home Team") {
                return 'red';
            } else {
                return 'blue';
            }
        });

    legend.append("text")
        .attr("y", function(d, i) {
            return i * 30 + 5;
        })
        .attr("x", radius * 5)
        .text(function(d) {
            return d;
        });
};