// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

  // Create the data table.
  var data = google.visualization.arrayToDataTable([
    ['Party', 'Number of Votes', { role: 'style' }],
    ['PDP', 3, 'green'],
    ['APGA', 1, 'pruple'],
    ['YPP', 1, 'brown'],
    ['UPP', 1, 'blue'],
    ['APC', 2, 'purple'],
    ['Others', 2, 'darkred']
  ]);

  // Set chart options
  var options = {'width':500,
                 'height':400};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.BarChart(document.getElementById('main_screen'));
  chart.draw(data, options);
}