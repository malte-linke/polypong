
const net = new NetworkManager();
const renderer = new Renderer("canvas");
const ui = new UI();


function loop(){
  requestAnimationFrame(loop);
  renderer.render();
}

loop();





/*

const playerSliderElem = document.querySelector("#amountPlayerSlider");

playerSliderElem.addEventListener("change", () => {
  let n = playerSliderElem.value;
  runData.players = [];
  for(let i = 0; i < n; i++){
    runData.players.push({ position: 0.5, size: 0.4 });
  }
});

*/