class NetworkManager {
  constructor() {
    this.socket = io();

    this.init();
  }


  init(){
    this.socket.on('createResult', this.createResultHandler);
    this.socket.on('joinResult', this.joinResultHandler);
    this.socket.on('runData', this.runDataHandler);
    this.socket.on('leaveResult', this.leaveResultHandler);
    this.socket.on('changeNameResult', this.changeNameResultHandler);
  }


  sendInput(dir){ 
    this.socket.emit('input', dir);
  }


  joinGame(gID){
    this.socket.emit('join', gID);
  }

  joinResultHandler(result){
    if(!result.successful) return console.log("Game join failed. Reason: " + result.reason);
    console.log("Game joined succesfully");
    ui.setLobbyState();
  }


  leaveGame(){
    this.socket.emit('leave');
  }
  
  leaveResultHandler(result){
    
  }

  changeName(name){
    this.socket.emit('changeName', name);
  }

  changeNameResultHandler(result){
    ui.changeNameResult(result);
  }


  createGame(gID){
    this.socket.emit('create', gID);
  }

  createResultHandler(result){
    if(!result.successful) {
      console.log("Game creation failed. Reason: " + result.reason);
      return;
    }

    ui.setLobbyState();
    console.log("Game created succesfully " + result.gID);
  }

  runDataHandler(runData){
    renderer.setRunData(runData);
  } 
}