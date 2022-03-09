
const net = new NetworkManager();
const renderer = new Renderer("canvas");
const ui = new UI();
const cl = new Changelog();
const game = new Game();
const sound = new SoundManager();


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

  //display fps
  renderer.ctx.fillStyle = "red";
  renderer.ctx.font = "20px Arial";
  renderer.ctx.fillText(Math.floor(1000/deltaTime), 10, 20);
}


loop();


