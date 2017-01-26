'use strict';


/**
 * Draw the high level components that make up the titanic interactive chart.
 * Composed of:
 *   - Title and description
 *   - Bar chart
 *   - Play button
 *   - filter
 */
function Titanic(csvData, options) {  
  // Controls whether interactive chart is playing through story.
  this.on_ = true;
  this.colorPool_ = this.getColorPool_();
  this.categories_ = this.getFilterableCategories_();
  this.stories_ = this.getStories_();

  this.renderVisualItems(csvData, options);

  // Start story.
  this.setToOn();  
};

Titanic.prototype.renderVisualItems = function(data, options) {
  // Title must be added first.
  this.container_ = d3.select(options.divId);

  var documentWidth = d3.select('body').node().getBoundingClientRect().width
                        - 140;

  options.width = documentWidth;
  options.height = documentWidth * .5;

  this.addTitle('Titanic Survival Propability');
  this.addDescription();
  this.playContainer_ = this.addPlay(this.container_);
  this.addFilter(data, this.categories_);

  this.barChart_ = this.addBarChart([], options);
};

Titanic.prototype.addTitle = function(title) {
  this.container_.append('h2')
            .attr('class', 'title')
            .text(title);
};

Titanic.prototype.addDescription = function(description) {
  this.container_.append('h3')
            .attr('class', 'description');
};

Titanic.prototype.updateDescription = function(description) {
  this.container_.select('.description')
            .text(description);
};

Titanic.prototype.addFilter = function(data, options) {
  var filter = this.container_.append('div')
                         .attr('class', 'titanic-filter');

  filter.append('span')
         .text('Group Data by:');

  this.categories_.forEach(function(category) {
    var inputHTML = '<input type="radio" name="category" value="' + category + '" >' + 
                    category;

    filter.append('label')
           .html(inputHTML);
  });

  
  filter.selectAll('input').on('change', function() {
    var key = '';
    this.setToOff();

    filter.selectAll('input:checked').each(function(element) {
      key = this.value;
    });

    var nestedData = this.nestData(data, key);

    this.barChart_.update(nestedData);
  }.bind(this));           
};

Titanic.prototype.addBarChart = function(data, options) {
  // Append root element where all chart components will be contained in.
  var svg = this.container_.append('svg')
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
};

Titanic.prototype.addPlay = function() {
  var playContainer = this.container_.append('div');

  playContainer.on('click', function() {
    if (this.on_) {
      this.setToOff();
    } else {
      this.setToOn();
    }
  }.bind(this));

  return playContainer;
};

Titanic.prototype.setToOn = function() {
  this.playContainer_.html('');
  this.on_ = true;

  this.playContainer_.attr('class', 'titanic-play')
              .append('div')
              .attr('class', 'off')
              .html('&#9612 &#9612');
};

Titanic.prototype.setToOff = function() {
  this.playContainer_.html('');
  this.on_ = false;

  this.playContainer_.attr('class', 'titanic-play')
              .append('div')
              .attr('class', 'on')
              .html('&#9654;');
  
};

Titanic.prototype.triggerPlay = function(data) {
  var currentStoryIndex = 0;

  var intervalId = setInterval(function() {
    nextStory.bind(this)();
  }.bind(this), 1000);

  function nextStory() {
    if (currentStoryIndex >= this.stories_.length) {
      clearInterval(intervalId);
      return;
    }

    var story = this.stories_[currentStoryIndex];
    currentStoryIndex += 1;

    var category = story.category;

    var nestedData = this.nestData(data, category);

    this.updateDescription(this.container_, story.question);
    this.barChart_.update([]);

    setTimeout(function() {
      this.updateDescription(this.container_, story.answer);
      this.barChart_.update(nestedData);
    }.bind(this), 1000);
  }

  nextStory.bind(this)();
};

Titanic.prototype.nestData = function(data, key) {
  var nestedData = d3.nest()
                      .key(function(d) {
                        return d[key]; 
                      })
                      .rollup(function(d) {
                        // Round to the second decimal place.
                        return Math.round(10000 * (d3.mean(d, function(d) { 
                          return d['Survived']; 
                        }))) / 100; 
                      })
                      .entries(data.filter(function(d) {
                        return d[key]; 
                      }));

  nestedData.sort(function(a, b) {
    return a.key > b.key;
  })
  .forEach(function(item, index) {
    item.color = this.colorPool_[index];
  }.bind(this));

  return nestedData;
};

Titanic.prototype.getColorPool_ = function() {
  return [
    '#1ABC9C',
    '#2ECC71',
    '#3498DB',
    '#9B59B6',
    '#34495E',
    '#E67E22',
    '#95A5A6',
    '#F1C40F',
    '#ECF0F1',
    '#C0392B',
    '#7F8C8D'
  ];
};

Titanic.prototype.getFilterableCategories_ = function() {
  return [
    'Age',
    'Gender',
    'Fare',
    'Pclass'
  ];
};

Titanic.prototype.getStories_ = function() {
  return [
    {
      question: 'Can you guess which sex survived the least?',
      answer: 'You guessed it!',
      category: 'Fare',
    },
    /*{
      question: 'Can you guess which age group survived the least?',
      answer: 'You guessed it!',
      category: 'Age'
    },
    {
      question: 'Can you guess which age group survived the least?',
      answer: 'You guessed it!',
      category: 'Fare'
    },
    {
      question: 'Can you guess which age group survived the least?',
      answer: 'You guessed it!',
      category: 'Embarked'
    },
    {
      question: 'Can you guess which age group survived the least?',
      answer: 'You guessed it!',
      category: 'Pclass'
    },*/
  ];
};