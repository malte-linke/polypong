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
    ui.joinGameResult(result);
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
    ui.hostGameResult(result);
  }

  runDataHandler(runData){
    renderer.setRunData(runData);
  } 
}