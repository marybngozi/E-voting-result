fetch('assets/lga.json')
.then(res => res.json())
.then(result => {
  let results = result.sort((a, b) => (a.LGA > b.LGA) ? 1 : -1)
  // console.log(results);

  results.forEach(d => {
    let optionsEle = `<option data-sd="${d.SD}" data-fc="${d.FC}" value="${d.LGA}">`;
    document.querySelector('#lgas').insertAdjacentHTML('beforeend', optionsEle);
  });
});