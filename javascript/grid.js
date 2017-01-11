function Grid(container, options) {
  this.options_ = options;

  this.xScale_ = this.addXAxis(container, '', options.x, 
                             options.y + options.height, options.width, 
                             options.height);

  this.yScale_ = this.addYAxis(container, '', options.x, options.y, 
                             options.height, options.width);
}

Grid.prototype.addXAxis = function(container, description, x, y, width, 
                                   tickLength) {
  // SVG coordinates start from top left, therefore bottom left position of 
  // chart is equal to [0, length].
  var translation = 'translate(' + x + ', ' + y + ')';

  var xScale = d3.scaleLinear()
                  .range([0, width])
                  .domain([1, 100]);

  tickLength = -tickLength;

  // Strict type check against false, since abset attribute signifies default 
  // behavior.
  if (this.options_.xTicks === false) {
    tickLength = 0;
  }

  var xAxis = d3.axisBottom()
                 .scale(xScale)
                 .tickSizeInner(tickLength)
                 .tickSizeOuter(0)
                 .tickPadding(1)
                 .tickFormat('');

  container.append('g')
            .attr('class', 'x axis')
            .attr('transform', translation)
            .call(xAxis);

  return xScale;
};

Grid.prototype.addYAxis = function(container, description, x, y, height, 
                                   tickLength) {
  var translation = 'translate(' + x + ', ' + y + ')';

  var yScale = d3.scaleLinear()
                   // Since we are starting from top left, we make domain 
                   // go in reverse order.
                   .range([height, 0])
                   .domain([1, 100]);

  var yAxis = d3.axisLeft()
                 .scale(yScale)
                 .tickSizeInner(-tickLength)
                 .tickSizeOuter(0)
                 .tickPadding(5);

  container.append('g')
            .attr('class', 'y axis')
            .attr('transform', translation)
            .call(yAxis);

  return yScale;
};

Grid.prototype.getScales = function() {
  return {
    x: this.xScale_,
    y: this.yScale_
  };
};