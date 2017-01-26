/*
  Use D3 (not dimple.js) to load the TSV file
  and pass the contents of it to the draw function
  */
d3.csv("data/titanic_data.csv", function(d) {
      return d;
  }, function(csvData){ 

    var chartOptions = {
      title: 'test',
      divId: '#chart-loc',
      width: 1000,
      height: 600,
      margin: 75,
    };


    var data = [
      {
        category: 'male',
        survivalRate:  .4
      },
      {
        category: 'female',
        survivalRate:  .6
      },
      {
        category: '10-15',
        survivalRate:  .2
      },
      {
        category: '16-25',
        survivalRate:  .7
      },
      {
        category: '26-35',
        survivalRate:  .9
      },
      {
        category: '36-50',
        survivalRate:  .23
      },
      {
        category: '50 +',
        survivalRate:  .04
      }
    ]

    //draw(data);
    new Titanic(csvData, chartOptions);
  });