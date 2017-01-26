/**
 * Draws a chart with in the 'container' element.
 */
function Chart(container, barType, data, options) {

  this.container_ = container;
  this.grid_ = null;
  this.options_ = options;

  // Only bar chart is handled at this point.
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

  var barItems = this.createBarItems(data);

  this.styleBarItems(barItems, data.length);
};

Chart.prototype.createBarItems = function(data) {
  return this.container_
              .selectAll('rect')
              .data(data)
              .enter();
};

Chart.prototype.update = function(data) {
  var keyFunc = function(d) {
    return d['category'];
  };

  var bars = this.container_.selectAll('.bar-items')
                             .data(data, keyFunc);

  bars.exit().remove();

  var barItems = bars.enter();
  this.styleBarItems(barItems, data.length);
};

Chart.prototype.update = function(data) {
  var keyFunc = function(d) {
    return d['category'];
  };

  var bars = this.container_.selectAll('.bar-items')
                             .data(data, keyFunc);

  bars.exit().remove();

  var barItems = bars.enter();
  this.styleBarItems(barItems, data.length);
};

Chart.prototype.getBarHeight = function(yScale, value) {
  return (yScale(100 - 99) - yScale(value));
};

Chart.prototype.getBarWidth = function(xScale, numOfItems) {
  if (numOfItems > 9) {
    return xScale(100/numOfItems);
  } else {
    return xScale(16) - xScale(10);
  }
};

Chart.prototype.styleBarItems = function(barItems, numOfItems) {
  var axisScales = this.grid_.getScales();
  var barWidth = this.getBarWidth(axisScales.x, numOfItems);

  
  var barItemsG = this.createBarsstyleBar(barItems);

  this.styleTooltip(barItemsG);
  this.styleText(barItemsG);
};

Chart.prototype.styleBar = function(barItems) {
  var barTranslationFunction = function(d, index) {
    index += 1;
    var x =  axisScales.x(10 * index) + this.options_.x - barWidth/2;
    var y = axisScales.y(1) + this.options_.y - 
              this.getBarHeight(axisScales.y, d.value);

    return  'translate(' + x + ', ' + y + ')';
  }.bind(this);

  var barItemsG = barItems.append('g')
           .attr('class', 'bar-items')
           .attr('transform', barTranslationFunction)
           .attr('width', function(d) {
             return barWidth;
           })
           .attr('height', function(d) {
             return this.getBarHeight(axisScales.y, d.value);
           }.bind(this));
           console.log(barItems);

  var bars = barItemsG.append('rect')
           .attr('fill', function(d) {
             return d.color;
           })
           .attr('width', function(d) {
             return barWidth;
           })
           .attr('height', function(d) {
             return this.getBarHeight(axisScales.y, d.value);
           }.bind(this));

  return bars;
}

Chart.prototype.styleTooltip = function(bars) {

  var div = d3.select('body').append('div') 
    .attr('class', 'tooltip')       
    .style('opacity', 0);

  

  bars.on('mouseover', function(d) {
        var barPos = d3.select(this.parentNode).attr('transform').split('(')[1]
                        .split(')')[0].split(',');

        div.transition()
            .duration(200)
            .style('opacity', .9);
        div.html(d.value)
            .style('left', (parseInt(barPos[0]) + (barWidth/2) - 10) + 'px')
            .style('top', (parseInt(barPos[1]) + 30) + 'px');
      })
      .on('mouseout', function(d) {
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });
}

Chart.prototype.styleText = function(barItemsG) {
  var textTranslationFunction = function(d, i, elementItems) {
    var y = this.getBarHeight(axisScales.y, d.value) + 20;
    var el = elementItems[i];

    var centerX = (barWidth/2) - (el.getComputedTextLength()/2);

    return  'translate(' + centerX + ', ' + y + ')';
  }.bind(this);

  barItemsG.append('text')
           .text(function(d){ return d['key']; })
           .attr('fill', function(d) {
             return d.color;
           })
           .attr('transform', textTranslationFunction);
}