class NetworkManager {
  constructor() {
    this.socket = io();
    this.pID = null;

    this.init();
  }


  init(){

  }


  sendInput(dir){
    this.socket.emit('input', dir);
  }


  joinGame(gID){
    console.log("Emitted join Game");
    this.socket.emit('join', gID);
  }

  joinResultHandler(){

  }


  createGame(){
    console.log("Emitted create Game");
    this.socket.emit('create', gID);
  }

  createResultHandler(){

  }
}