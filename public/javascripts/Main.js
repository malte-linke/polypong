
const net = new NetworkManager();
const renderer = new Renderer("canvas");
const ui = new UI();


function loop(){
  requestAnimationFrame(loop);
  renderer.render();
}

loop();