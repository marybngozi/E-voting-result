let senatorial = [];
let lgaArr = [];

fetch('assets/lga.json')
.then(res => res.json())
.then(result => {
  let results = result.sort((a, b) => (a.LGA > b.LGA) ? 1 : -1);
  results.forEach(d => {
    let optionsEle = `<option value="${d.LGA}">`;
    document.querySelector('#lgas').insertAdjacentHTML('beforeend', optionsEle);
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
        if (b.election == 'Senatorial') {
          eachObj['lga'] = d.voter.lga;
          eachObj['electionCode'] = b.electionCode;
          eachObj['party'] = b.party;
          lgaArr.push(d.voter.lga);
          senatorial.push(eachObj);
        }
      });
      // console.log(eachObj);
    });
  })
  .catch(err => {
    console.log(err);
  })

  //Create Distinct Array of lgas
  let lgas = lgaArr.filter((it, i, ar) => ar.indexOf(it) === i);

  // Create an Object with lgas and the parties for them
  let LPObj = {};

  lgas.forEach(lga => {
    let tempArr = [];
    let tempObj = {};
    senatorial.forEach(it => {
      if (it.lga === lga) {
        tempArr.push(it.party);
      }
    });
    tempArr.forEach((x) => {tempObj[x] = (tempObj[x] || 0) + 1;});
    let lgaData = sortNarrnge(tempObj)[0];
    LPObj[lga] = lgaData;
  });
  window.name = JSON.stringify(LPObj);

  let partySeats = {};
  let partyArr = [];
  for (const lga in LPObj) {
    if (LPObj.hasOwnProperty(lga)) {
      const party = Object.keys(LPObj[lga])[0];
      partySeats[lga] = party;
      partyArr.push(party);
    }
  }

  partySeats = {};
  partyArr.forEach((x) => {partySeats[x] = (partySeats[x] || 0) + 1;});
  let lgaData = sortNarrnge(partySeats)[0];

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(() => {
    let ccnt = 0
    let tarr = [];
    // console.log(lgaData);
    for (const party in lgaData) {
      if (lgaData.hasOwnProperty(party)) {
        const vote = lgaData[party];
        tarr.push([party, vote, colorArr[ccnt]]);
      }
      ccnt += 1;
    }

    // Create the data table.
    var data = google.visualization.arrayToDataTable([
      ['Party', 'Seats', { role: 'style' }],
      ...tarr
    ]);

    // Set chart options
    var options = {'width':700,'height':466,'title':'Number of Seats','legend':'none'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.querySelector('#mained_screen'));
    chart.draw(data, options);
  });
}

getVotes();

const getEachLgaVotes = (lga) => {
  let data = JSON.parse(window.name);
  // console.log(data);
  let partyDetail = data[lga];
  if (partyDetail) {
    document.querySelector('#headng').innerHTML = lga+' LGA Senatorial Election Result';
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
      var chart = new google.visualization.BarChart(document.querySelector('#mained_screen'));
      chart.draw(data, options);
    });
    // Upadate Total NUmber of Votes
    document.querySelector('#totalV').innerHTML = "Total Number of votes = "+getSumVotes(partyDetail);

  }else{
    document.querySelector('#mained_screen').innerHTML = '';
    document.querySelector('#headng').innerHTML = 'No Result Data for '+lga+' LGA Senatorial Election';
  }
}

document.querySelector('#search_btn').addEventListener('click', () => {
  let lgaValue = document.querySelector('#input_lgas').value;
  if(!lgaValue){
    // Do Nothing
  }else{
    getEachLgaVotes(lgaValue.trim());
  }
})