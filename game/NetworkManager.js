var game = require('./Game');
var { ID } = require('./Utils');

var server = null;

module.exports = {

    // Needed to get the http server instance from the express app
    createServer: (httpServer) => {
      const { Server } = require("socket.io");
      const io = new Server(httpServer);

      server = new NetworkManager(io);
    },

    // Return the server instance
    server: server
}


class NetworkManager {

  constructor(io) {
    this.server = io;
    this.games = [];
    this.players = [];

    this.clockFPS = 60;
    this.clock = setInterval(this.clockTick.bind(this), 1000/this.clockFPS);
    this.lastTime = Date.now();


    this.init();
  }


  init(){
    this.server.on('connection', (socket) => {
      this.auth(socket);
      
      socket.on("join", (data) => this.joinGameHandler(socket, data));
      socket.on("leave", (data) => this.leaveGameHandler(socket, data));
      socket.on("create", (data) => this.createGameHandler(socket, data));
      socket.on("disconnect", (data) => this.disconnectHandler(socket, data));
      socket.on("input", (data) => this.inputHandler(socket, data));
      socket.on("changeName", (data) => this.changeNameHandler(socket, data));
    });
  }

  auth(socket){
    // Generate Random Player ID
    while(true){
      var pID = ID.genID(8);
      if(!this.players.map(p => p.pID).includes(pID)) break;
    }

    socket.pID = pID;
    socket.gID = null;

    this.players.push(socket);

    console.log(`[+] Player ${pID} connected`);
  }

  clockTick(){

    // calculate delta time
    this.timeNow = Date.now();
    let deltaTime = this.timeNow - this.lastTime;
    this.lastTime = this.timeNow;
    let deltaTimeFactor = deltaTime / (1000/60);

    this.games.forEach(g => {
      g.update(deltaTimeFactor);

      let runData = g.getNewRunData();
      if(runData == null) return;

      let sockets = g.runData.players.map(p => this.getSocketByID(p.pID));

      // filter out undefined sockets aka bots or walls etc.
      sockets = sockets.filter(s => s != undefined);

      
      //try catch in case player disconnects
      try{
        sockets.forEach(p => {
          // sets your own pID to "you"
          let currentPlayer = runData.players.find(_p => _p.pID == p.pID);
          currentPlayer.pID = "you";
          p.emit("runData", runData);
          currentPlayer.pID = p.pID;
        });
      }catch(e){}
    });
  }


  //
  // Handlers
  //

  changeNameHandler(socket, name){

    if(socket.pID == name) return socket.emit("changeNameResult", { successful: true });

    if(name.length < 1) 
      return socket.emit("changeNameResult", { successful: false, reason: "Name must be at least 1 character long" });

    if(this.players.map(p => p.pID).includes(name))
      return socket.emit("changeNameResult", { successful: false, reason: "Name already taken" });

    console.log(`[#] Player ${socket.pID} changed name to ${name}`);
    socket.pID = name;
    socket.emit("changeNameResult", { successful: true });
  }

  disconnectHandler(socket, _){

    if(socket.gID != null) this.leaveGameHandler(socket, {});

    this.players = this.players.filter(p => p.pID != socket.pID);
    
    console.log(`[-] Player ${socket.pID} disconnected`);
  }

  leaveGameHandler(socket, _){
    // get game instance
    let game = this.getGameByID(socket.gID);
    if(game == undefined) return socket.gID = null;

    //check if player is in game
    if(!game.runData.players.map(p => p.pID).includes(socket.pID) && game.host != socket.pID) return socket.gID = null;
    let shouldClose = game.removePlayer(socket.pID);

    socket.gID = null;

    console.log(`[~] Player ${socket.pID} left the game ${game.gID}`);

    //close if host left (for now)
    if(shouldClose){
      this.games = this.games.filter(g => g.gID != game.gID);
      game.runData.players.forEach(p => p.gID = null);
      console.log(`[-] Game ${game.gID} closed`);
    }
  }

  createGameHandler(socket, gID){

    // check if id is valid
    if(this.games.map(g => g.gID).includes(gID)) 
      return socket.emit("createResult", { successful: false, reason: "Lobby name already taken" });

    if(gID.length < 3) 
      return socket.emit("createResult", { successful: false, reason: "Lobby name must be at least 3 characters long" });
    

    //instanciate game
    this.games.push(new game(gID));

    // send gameID to player
    socket.emit("createResult", { successful: true, gID });

    console.log(`[+] Game ${gID} created`);

    //add host to game
    this.joinGameHandler(socket, gID);
  }

  joinGameHandler(socket, gID){

    // check if player already in game
    if(socket.gID != null) return socket.emit("joinResult", { successful: false, reason: "Already in a game. How did u even do this?" });
    
    //get game instance
    let game = this.getGameByID(gID);

    if(game == undefined)
      return socket.emit("joinResult", { successful: false, reason: "Game not found" });
    

    game.addPlayer(socket.pID);

    //set gID to game 
    socket.gID = gID;

    // send result to player
    socket.emit("joinResult", { successful: true });

    console.log(`[~] Player ${socket.pID} joined Game ${gID}`);
  }

  inputHandler(socket, dir){

    if(socket.gID == null) return;

    // get game instance
    let game = this.getGameByID(socket.gID);
    if(game == undefined) return;

    //check if player is in game
    if(!this.isPlayerInGame(socket.pID, socket.gID)) return socket.gID = null;

    //if(dir == "f") game.addPlayer(game.runData.players.length + "fff");

    game.handlePlayerInput(socket.pID, dir);
  }


  //
  // Helper Functions
  //
  getGameByID(gID){
    return this.games.find(game => game.gID == gID);    
  }

  isPlayerInGame(pID, gID){
    let game = this.getGameByID(gID);
    return game.runData.players.map(p => p.pID).includes(pID);
    //TODO: what about game exists
  }

  getSocketByID(pID){
    return this.players.find(p => p.pID == pID);
  }
}