const net = new NetworkManager();
const renderer = new Renderer("canvas");

const playerSliderElem = document.querySelector("#amountPlayerSlider");

playerSliderElem.addEventListener("change", () => {
  let n = playerSliderElem.value;
  runData.players = [];
  for(let i = 0; i < n; i++){
    runData.players.push({ position: 0.5, size: 0.4 });
  }
});



let runData = {
  players : [
    { position: 0, size: 0.5, pID: 0 },
    { position: 0.5, size: 0.5, pID: 1 },
    { position: 1, size: 0.5, pID: 2 },
  ],
  balls : [
    { 
      position: {x: 0.5, y: 0.5} ,
      radius: 0.01
    } 
  ],
}


function loop(){
  requestAnimationFrame(loop);

  renderer.render(runData);
}

net.createGame("12345678");

loop();


