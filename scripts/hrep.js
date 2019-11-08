let houseOfRep = [];
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
        if (b.election == 'House of Rep') {
          eachObj['lga'] = d.voter.lga;
          eachObj['electionCode'] = b.electionCode;
          eachObj['party'] = b.party;
          lgaArr.push(d.voter.lga);
          houseOfRep.push(eachObj);
        }
      });
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
    houseOfRep.forEach(it => {
      if (it.lga === lga) {
        tempArr.push(it.party);
      }
    });
    tempArr.forEach((x) => {tempObj[x] = (tempObj[x] || 0) + 1;});
    let lgaData = sortNarrnge(tempObj)
    LPObj[lga] = lgaData;
  });
  window.name = JSON.stringify(LPObj);

  // Set a callback to run when the Google Visualization API is loaded.
  /* google.charts.setOnLoadCallback(() => {
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
      ['Party', 'Seats', { role: 'style' }],
      ...tarr
    ]);

    // Set chart options
    var options = {'width':900,'height':500,'title':'Number of Seats','legend':'none'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.querySelector('#main_screen'));
    chart.draw(data, options);
  }); */
}

getVotes();

const getEachLgaVotes = (lga) => {
  let data = JSON.parse(window.name);
  let partyDetail = data[lga];
  if (partyDetail) {
    document.querySelector('#headng').innerHTML = lga+' LGA houseOfRep Election Result';
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
      var options = {'width':700,'height':500,'title':'Number of Votes','legend':'none'};

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(document.querySelector('#main_screen'));
      chart.draw(data, options);
    });
  }else{
    document.querySelector('#main_screen').innerHTML = '';
    document.querySelector('#headng').innerHTML = 'No Result Data for '+lga+' LGA houseOfRep Election';
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