const net = new NetworkManager();
const renderer = new Renderer("canvas");
const ui = new UI();

let lastTime = Date.now();

function loop(){
  requestAnimationFrame(loop);
  renderer.render();

  // calculate delta time
  let thisTime = Date.now();
  let deltaTime = (thisTime - lastTime);
  lastTime = thisTime;
  let deltaTimeFactor = deltaTime / (1000/60);

  // update runData
  Game.updateRunData(renderer.runData, deltaTimeFactor);
}

loop();
net.createGame("adasda");