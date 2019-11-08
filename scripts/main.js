const dater = () => {
  document.querySelector('.time').innerHTML = new Date().toString().slice(0, 24);
}

setInterval(() => {
  dater();
}, 1000);

let path = 'http://localhost:8000';

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

let colorArr = ['#003300','#004d00','#006600','#008000','#009900','#00b300'];