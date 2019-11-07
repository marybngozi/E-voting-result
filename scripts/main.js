const dater = () => {
  document.querySelector('.time').innerHTML = new Date().toString().slice(0, 24);
}

setInterval(() => {
  dater();
}, 1000);



