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
    this.socket.on('playerLeave', this.playerDisconnectHandler);
    this.socket.on('playerJoin', this.playerConnectHandler);
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
    game.runData = runData;
  } 

  playerDisconnectHandler(pID){
    renderer.displayPlayerNotification(`${pID} left the game`);
  }

  playerConnectHandler(pID){
    renderer.displayPlayerNotification(`${pID} joined the game`);
  }
}