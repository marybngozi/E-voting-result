const dater = () => {
  document.querySelector('.time').innerHTML = new Date().toString().slice(0, 24);
}

setInterval(() => {
  dater();
}, 1000);

// let path = 'http://localhost:8000';
let path = 'https://evote-server.herokuapp.com';

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

let colorArr = ['#003300','#004d00','#006600','#008000','#009900','#00b300'];

let sumerd;

const sortNarrnge = (obj) => {
  let sortParty = {};
  Object.keys(obj).sort((a,b) => obj[b] - obj[a]).forEach(key => sortParty[key] = obj[key]);

  let cnt = 0;
  let sume = 0;
  let sumed = 0;
  let chartObj = {};
  for (const party in sortParty) {
    if (sortParty.hasOwnProperty(party)) {
      const trest = sortParty[party];
      if (cnt < 5) {
        chartObj[party] = trest;
        sumed += trest;
      }else{
        sume += trest;
        sumed += trest;
      }
      cnt += 1;
    }
  }
  chartObj['Others'] = sume;

  sumerd = sumed;
  return [chartObj, sumed];
}

const getSumVotes = (obj) => {
  let sum = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sum += obj[key];
    }
  }
  return sum;
}