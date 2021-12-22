const net = new NetworkManager();
const renderer = new Renderer("canvas");
const ui = new UI();
const game = new Game();

let lastTime = Date.now();

function loop(){
  requestAnimationFrame(loop);

  // calculate delta time
  let thisTime = Date.now();
  let deltaTime = (thisTime - lastTime);
  lastTime = thisTime;
  let deltaTimeFactor = deltaTime / (1000/60);

  // update runData
  game.update(deltaTimeFactor);

  renderer.render(game.runData);
}

loop();
//net.joinGame("abc");
//net.createGame("abc");
