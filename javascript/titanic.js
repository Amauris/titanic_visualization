'use strict';


/**
 * Draw the high level components that make up the interactive chart.
 */
function Titanic(data, options) {
  this.on_ = true;
  var container = d3.select(options.divId);

  var colorPool = [
    '#000',
    '#F00',
    '#0F0',
    '#00F',
    '#FF0',
    '#0FF'
  ];

  var categoryToIndex = {
    'male': 1,
    'female': 2,
    '10-15': 3,
    '16-25': 4,
    '26-35': 5,
    '36-50': 6,
    '50 +': 7
  };

  data.forEach(function(item, i) {
    item.color = colorPool[i];
    item.index = categoryToIndex[item.category];
  });

  // Title must be added first.
  this.addTitle(container, options.title);
  this.barChart_ = this.addBarChart(container, data, options);
  
  this.playContainer_ = this.addPlay(container);
  this.setToOn();

  this.addFilter(container, data, [
    'male', 
    'female',
    '10-15',
    '16-25',
    '26-35',
    '36-50',
    '50 +'
    ]);

  setInterval(function() {
        
        var length = Math.floor(Math.random() * data.length);
        var keys = [];

        for (; length > 0; length -= 1) {
          var randIndex = Math.floor(Math.random() * data.length);
          var category = data[randIndex]['category'];

          if (keys.indexOf(category) === -1) {
            keys.push(category);
          }
        }

        this.barChart_.update(data, keys);

      }.bind(this), 10000);

  /*this.addPlay(container, options.title);
  this.addFilter(container, options.title);*/

  // Append svg/root of all graphical components.
  
  /*
  renderBar();
  renderPlay();
  renderFilter();*/
};

Titanic.prototype.addTitle = function(container, title) {
  container.append('h2')
            .text(title);
}

Titanic.prototype.addBarChart = function(container, data, options) {
  // Append root element where all chart components will be contained in.
  var svg = container.append('svg')
                      .attr('width', options.width)
                      .attr('height', options.height);

  var chartOptions = {
    x: options.margin,
    y: options.margin,
    width: options.width - (2 * options.margin),
    height: options.height - (2 * options.margin),
    xLabel: '',
    yLabel: '',
  };

  return new Chart(svg, 'bar', data, chartOptions);
}

Titanic.prototype.addPlay = function(container) {
  var playContainer = container.append('div');

  playContainer.on('click', function() {
    if (this.on_) {
      this.setToOff();
    } else {
      this.setToOn();
    }
  }.bind(this));

  return playContainer;
}

Titanic.prototype.setToOn = function() {
  this.playContainer_.html('');
  this.on_ = true;

  this.playContainer_.attr('class', 'titanic-play')
              .append('div')
              .attr('class', 'on')
              .html('&#9654;');
};

Titanic.prototype.setToOff = function() {
  this.playContainer_.html('');
  this.on_ = false;

  this.playContainer_.attr('class', 'titanic-play')
              .append('div')
              .attr('class', 'off')
              .html('&#9612 &#9612');
};

Titanic.prototype.addFilter = function(container, data, options) {
  var filter = container.append('div')
                         .attr('class', 'titanic-filter');

  filter.append('span')
         .text('Group Data by:');

  options.forEach(function(option) {
    var inputHTML = '<input type="checkbox" value="' + option + '" >' + option;
    filter.append('label')
           .html(inputHTML);
  });

  
  filter.selectAll('input').on('change', function() {
    var keys = [];
    this.setToOff();

    filter.selectAll('input:checked').each(function(element) {
      keys.push(this.value);
    });

    this.barChart_.update(data, keys);
  }.bind(this));                
}