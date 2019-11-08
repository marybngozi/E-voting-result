const dater = () => {
  document.querySelector('.time').innerHTML = new Date().toString().slice(0, 24);
}

setInterval(() => {
  dater();
}, 1000);

let path = 'http://localhost:8080';

let senatorial = [];
let presidential = [];
let hrep = [];

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

const getVotes = async() => {
  /* let fetched = await fetch(`${path}/evoting_api/v1/votes/`)
  .then(res => res.json())
  .then(result => {
    result.forEach(d => {
      let votes = d.votes;
      votes.forEach(b => {
        if (b.election == 'Senatorial') {
          senatorial.push(b);
        }else if (b.election == 'Presidential'){
          presidential.push(b);
        }else if (b.election == 'House of Rep') {
          hrep.push(b);
        }
      });
    });
  })
  .catch(err => {
    console.log(err);
  })

  let partiesArr = presidential.map(vote => vote.party);
  let partiesObj = {};
  partiesArr.forEach((x) => {partiesObj[x] = (partiesObj[x] || 0) + 1;}); */

  let fp = {PDP: 5, NPM: 1, AA: 1, A: 2, YPP: 7, APGA: 12, NUP: 3, AAC: 6, CAP:2, UPP:4};

  let sortParty = {};
  Object.keys(fp).sort((a,b) => fp[b] - fp[a]).forEach(key => sortParty[key] = fp[key]);

  let cnt = 0;
  let sume = 0;
  let chartPresObj = {};
  for (const party in sortParty) {
    if (sortParty.hasOwnProperty(party)) {
      const trest = sortParty[party];
      if (cnt < 5) {
        chartPresObj[party] = trest;
        console.log(party+' has '+trest+' votes.');
      }else{
        sume += trest;
      }
      cnt += 1;
    }
  }
  chartPresObj['Others'] = sume;
  console.log('Others has '+sume+' votes.');
  console.log(chartPresObj);

  let colorArr = ['#003300','#004d00','#006600','#008000','#009900','#00b300']

  // Set a callback to run when the Google Visualization API is loaded.
  if(page === 'president'){
    google.charts.setOnLoadCallback(drawChartPresident);
  }else if(page === 'senatorial'){
    google.charts.setOnLoadCallback(drawChartSenatorial);
  }else if(page === 'hrep') {
    google.charts.setOnLoadCallback(drawChartHrep);
  }

  function drawChartPresident() {
    let ccnt = 0
    let tarr = [];
    for (const party in chartPresObj) {
      if (chartPresObj.hasOwnProperty(party)) {
        const vote = chartPresObj[party];
        tarr.push([party, vote, colorArr[ccnt]]);
      }
      ccnt += 1;
    }

    /* let tarr = [
      ['APGA', 10, '#004d00'],
      ['YPP', 5, '#006600'],
      ['UPP', 4.5, '#008000'],
      ['APC', 7, '#009900'],
      ['Others', 2, '#00b300']
    ] */

    // Create the data table.
    var data = google.visualization.arrayToDataTable([
      ['Party', 'Votes', { role: 'style' }],
      // ['PDP', 8.5, '#003300'],
      ...tarr
    ]);

    // Set chart options
    var options = {'width':900,'height':500,'title':'Number of Votes','legend':'none'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('main_screen'));
    chart.draw(data, options);
  }

  function drawChartSenatorial() {
    // Create the data table.
    var data = google.visualization.arrayToDataTable([
      ['Party', 'Seats', { role: 'style' }],
      ['PDP', 8, '#003300'],
      ['APGA', 10, '#004d00'],
      ['YPP', 15, '#006600'],
      ['UPP', 5, '#008000'],
      ['APC', 7, '#009900'],
      ['Others', 9, '#00b300']
    ]);

    // Set chart options
    var options = {'width':900,'height':500,'title':'Number of Seats Occupied by Parties','legend':'none'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('main_screen'));
    chart.draw(data, options);
  }

  function drawChartHrep() {
    // Create the data table.
    var data = google.visualization.arrayToDataTable([
      ['Party', 'Seats', { role: 'style' }],
      ['PDP', 5, '#003300'],
      ['APGA', 10, '#004d00'],
      ['YPP', 12, '#006600'],
      ['UPP', 4, '#008000'],
      ['APC', 7, '#009900'],
      ['Others', 6, '#00b300']
    ]);

    // Set chart options
    var options = {'width':900,'height':500,'title':'Number of Seats Occupied by Parties','legend':'none'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('main_screen'));
    chart.draw(data, options);
  }

}

getVotes();

