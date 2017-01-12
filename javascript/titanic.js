'use strict';


/**
 * Draw the high level components that make up the interactive chart.
 */
function Titanic(data, options) {
  this.on_ = true;
  var container = d3.select(options.divId);

  var documentWidth = d3.select('body').node().getBoundingClientRect().width
                        - 140;

  options.width = documentWidth;
  options.height = documentWidth*.5

  var colorPool = [
    '#1ABC9C',
    '#2ECC71',
    '#3498DB',
    '#9B59B6',
    '#34495E',
    '#E67E22',
    '#95A5A6',
    '#F1C40F'
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

  var stories = [
    {
      question: 'Can you guess which sex survived the least?',
      answer: 'You guessed it!',
      keys: ['male', 'female'],
    },
    {
      question: 'Can you guess which age group survived the least?',
      answer: 'You guessed it!',
      keys: ['10-15', '16-25', '36-50', '50 +']
    },
  ];

  data.forEach(function(item, i) {
    item.color = colorPool[i];
    item.index = categoryToIndex[item.category];
  });

  // Title must be added first.
  this.addTitle(container, 'Titanic Survival Propability');
  this.addDescription(container);
  this.playContainer_ = this.addPlay(container);

  this.barChart_ = this.addBarChart(container, data, options);
  
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

  var currentStoryIndex = 0;

  var intervalId = setInterval(function() {
    nextStory.bind(this)();
  }.bind(this), 10000);

  function nextStory() {
    if (currentStoryIndex >= stories.length) {
      clearInterval(intervalId);
      return;
    }

    var story = stories[currentStoryIndex];
    currentStoryIndex += 1;

    var keys = story.keys;
    this.updateDescription(container, story.question);
    this.barChart_.update(data, []);

    setTimeout(function() {
      this.updateDescription(container, story.answer);
      this.barChart_.update(data, keys);
    }.bind(this), 5000);
  }

  nextStory.bind(this)();
};

Titanic.prototype.addTitle = function(container, title) {
  container.append('h2')
            .attr('class', 'title')
            .text(title);
}

Titanic.prototype.addDescription = function(container, description) {
  container.append('h3')
            .attr('class', 'description');
}

Titanic.prototype.updateDescription = function(container, description) {
  container.select('.description')
            .text(description);
}

Titanic.prototype.addBarChart = function(container, data, options) {
  // Append root element where all chart components will be contained in.
  var svg = container.append('svg')
                      .attr('class', 'chart')
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