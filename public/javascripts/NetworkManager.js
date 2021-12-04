class NetworkManager {
  constructor() {
    this.socket = io();

    this.init();
  }


  init(){
    this.socket.on('createResult', this.createResultHandler);
    this.socket.on('joinResult', this.joinResultHandler);
    this.socket.on('runData', this.runDataHandler);
  }


  sendInput(dir){ 
    this.socket.emit('input', dir);
  }


  joinGame(gID){
    this.socket.emit('join', gID);
  }

  joinResultHandler(result){
    if(result.successful) console.log("Game joined succesfully");
    else console.log("Game join failed. Reason: " + result.reason);
  }


  leaveGame(){
    this.socket.emit('leave');
  }
  
  leaveResultHandler(result){
    
  }


  createGame(){
    this.socket.emit('create');
  }

  createResultHandler(result){
    console.log("Game created succesfully " + result.gID);
  }

  runDataHandler(runData){
    renderer.setRunData(runData);
  } 
}