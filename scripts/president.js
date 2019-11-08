let presidential = [];

fetch('assets/lga.json')
.then(res => res.json())
.then(result => {
  let states = result.map(pv => pv.State).filter((it, i, ar) => ar.indexOf(it) === i);

  states.forEach(state => {
    let optionsEle = `<option value="${state}">`;
    document.querySelector('#states').insertAdjacentHTML('beforeend', optionsEle);
  });
});

const getVotes = async() => {
  await fetch(`${path}/evoting_api/v1/votes/`)
  .then(res => res.json())
  .then(result => {
    result.forEach(d => {
      let eachObj = {};
      let votes = d.votes;
      votes.forEach(b => {
        if (b.election == 'Presidential'){
          eachObj['state'] = d.voter.state;
          eachObj['party'] = b.party;
          presidential.push(eachObj);
        }
      });
    });
  })
  .catch(err => {
    console.log(err);
  })

  let partiesArr = presidential.map(vote => vote.party);
  let partiesObj = {};
  partiesArr.forEach((x) => {partiesObj[x] = (partiesObj[x] || 0) + 1;});

  // let fp = {PDP: 5, NPM: 1, AA: 1, A: 2, YPP: 7, APGA: 12, NUP: 3, AAC: 6, CAP:2, UPP:4};

  let chartPresObj = sortNarrnge(partiesObj);

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChartPresident);

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

    // Create the data table.
    var data = google.visualization.arrayToDataTable([
      ['Party', 'Votes', { role: 'style' }],
      ...tarr
    ]);

    // Set chart options
    var options = {'width':700,'height':466,'title':'Number of Votes','legend':'none'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.querySelector('#main_screen'));
    chart.draw(data, options);
  }
}

const getStateVotes = async() => {
  await getVotes();

  let states = presidential.map(pv => pv.state).filter((it, i, ar) => ar.indexOf(it) === i);
  let SPObj = {};

  states.forEach(state => {
    let tempArr = [];
    let tempObj = {};
    presidential.forEach(it => {
      if (it.state === state) {
        tempArr.push(it.party);
      }
    });
    tempArr.forEach((x) => {tempObj[x] = (tempObj[x] || 0) + 1;});
    let stateData = sortNarrnge(tempObj)
    SPObj[state] = stateData;
  });
  window.name = JSON.stringify(SPObj);
}

getStateVotes();

const getEachStateVotes = (state) => {
  let data = JSON.parse(window.name);
  let partyDetail = data[state];
  if (partyDetail) {
    document.querySelector('#headng').innerHTML = state+' Presidential Election Result';
    google.charts.setOnLoadCallback(() => {
      let ccnt = 0
      let tarr = [];
      for (const party in partyDetail) {
        if (partyDetail.hasOwnProperty(party)) {
          const vote = partyDetail[party];
          tarr.push([party, vote, colorArr[ccnt]]);
        }
        ccnt += 1;
      }

      // Create the data table.
      var data = google.visualization.arrayToDataTable([
        ['Party', 'Votes', { role: 'style' }],
        ...tarr
      ]);

      // Set chart options
      var options = {'width':700,'height':466,'title':'Number of Votes','legend':'none'};

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(document.querySelector('#main_screen'));
      chart.draw(data, options);
    });
  }else{
    document.querySelector('#main_screen').innerHTML = '';
    document.querySelector('#headng').innerHTML = 'No Result Data for '+state+' State Presidential Election';
  }
}

document.querySelector('#search_btn').addEventListener('click', () => {
  let stateValue = document.querySelector('#input_state').value;
  if(!stateValue){
    // Do Nothing
  }else{
    getEachStateVotes(stateValue.trim());
  }
})