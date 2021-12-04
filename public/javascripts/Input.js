document.addEventListener("keydown", (e) => keyDownHandler(e));
document.addEventListener("keyup", keyUpHandler);

let dirKeys = [];


function keyDownHandler(e) {
  if(e.key == 'a' && !dirKeys.includes("a")) {
    dirKeys.push("a");
    net.sendInput("a");
  }
  else if(e.key == 'd' && !dirKeys.includes("d")) {
    dirKeys.push("d");
    net.sendInput("d");
  }
}

function keyUpHandler(e) {
  if(e.key == 'a') {
    dirKeys.splice(dirKeys.indexOf("a"), 1);
    if(dirKeys.length == 0) return net.sendInput("n");
    net.sendInput(dirKeys[0]);
  }
  else if(e.key == 'd') {
    dirKeys.splice(dirKeys.indexOf("d"), 1);
    if(dirKeys.length == 0) return net.sendInput("n");
    net.sendInput(dirKeys[0]);
  }
}


