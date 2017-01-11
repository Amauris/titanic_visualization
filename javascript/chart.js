/**
 * Draws a chart with in the 'container' element.
 */
function Chart(container, barType, data, options) {

  this.container_ = container;
  this.grid_ = null;
  this.options_ = options;

  switch(barType) {
    case 'bar':
      this.renderBarChart(data);
      break;
  }
}

/**
 * Draws a bar chart on top of grid.
 */
Chart.prototype.renderBarChart = function(data) {

  var options = this.options_;

  // Eliminate x ticks because x axis is categorical.
  options['xTicks'] = false;

  this.grid_ = new Grid(this.container_, options);
  var barItems = this.container_
                      .selectAll('rect')
                      .data(data)
                      .enter();

  this.renderBarItems(barItems);
}

Chart.prototype.renderBarItems = function(barItems) {
  var axisScales = this.grid_.getScales();
  var barWidth = this.getBarWidth(axisScales.x);

 var barTranslationFunction = function(d) {
    var index = d.index;
    var x =  axisScales.x(10 * index) + this.options_.x - barWidth/2;
    var y = axisScales.y(1) + this.options_.y - 
              this.getBarHeight(axisScales.y, d.survivalRate);

    return  'translate(' + x + ', ' + y + ')';
  }.bind(this);

  var barItemsG = barItems.append('g')
           .attr('class', 'bar-items')
           .attr('transform', barTranslationFunction)
           .attr('width', function(d) {
             return barWidth;
           })
           .attr('height', function(d) {
             return this.getBarHeight(axisScales.y, d.survivalRate);
           }.bind(this));

  var div = d3.select('body').append('div') 
    .attr('class', 'tooltip')       
    .style('opacity', 0);

  var bars = barItemsG.append('rect')
           .attr('fill', function(d) {
             return d.color;
           })
           .attr('width', function(d) {
             return barWidth;
           })
           .attr('height', function(d) {
             return this.getBarHeight(axisScales.y, d.survivalRate);
           }.bind(this));
  bars.on('mouseover', function(d) {
        var barPos = d3.select(this.parentNode).attr('transform').split('(')[1]
                        .split(')')[0].split(',');

        div.transition()
            .duration(200)
            .style('opacity', .9);
        div .html('HERE<br/>'  + d.close)
            .style('left', barPos[0] + 'px')
            .style('top', (parseInt(barPos[1]) + 20) + 'px');
      })
      .on('mouseout', function(d) {
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });

  var textTranslationFunction = function(d, i, elementItems) {
    var y = this.getBarHeight(axisScales.y, d.survivalRate) + 20;
    var el = elementItems[i];

    var centerX = (barWidth/2) - (el.getComputedTextLength()/2);

    return  'translate(' + centerX + ', ' + y + ')';
  }.bind(this);

  barItemsG.append('text')
           .text(function(d){ return d['category']; })
           .attr('fill', function(d) {
             return d.color;
           })
           .attr('transform', textTranslationFunction);
};

Chart.prototype.update = function(data, keys) {
  var filteredData = data.filter(function(d) {
    return keys.indexOf(d['category']) !== -1;
  });

  console.log(keys, filteredData);
  var keyFunc = function(d) {
    return d['category'];
  };

  var bars = this.container_.selectAll('.bar-items')
                             .data(filteredData, keyFunc);

  bars.exit().remove();

  var barItems = bars.enter();

  this.renderBarItems(barItems);
};

Chart.prototype.getBarHeight = function(yScale, value) {
  return (yScale(100 - 99) - yScale(100 * value));
};

Chart.prototype.getBarWidth = function(xScale) {
  return xScale(16) - xScale(10);
};