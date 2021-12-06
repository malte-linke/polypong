const { io } = require('socket.io-client');
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

    console.log("[+] Player-" + pID);
  }

  clockTick(){
    this.games.forEach(g => {
      g.update();

      let runData = g.getRunData();

      let players = g.runData.players.map(p => this.getSocketByID(p.pID));
      
      //try catch in case player disconnects
      try{
        players.forEach(p => {
          // set your own pID to "you"
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
  disconnectHandler(socket, _){

    if(socket.gID != null) this.leaveGameHandler(socket, {});

    this.players = this.players.filter(p => p.pID != socket.pID);
    
    console.log("[-] Player-" + socket.pID);
  }

  leaveGameHandler(socket, _){
    // get game instance
    let game = this.getGameByID(socket.gID);
    if(game == undefined) return socket.gID = null;

    //check if player is in game
    if(!game.players.map(p => p.pID).includes(socket.pID) && game.host != socket.pID) return socket.gID = null;
    let shouldClose = game.removePlayer(socket.pID);

    socket.gID = null;

    console.log(`[~] Player-${socket.pID} --> X`);

    //close if host left (for now)
    if(shouldClose){
      this.games = this.games.filter(g => g.gID != socket.gID);
      game.players.forEach(p => p.gID = null);
      console.log("[-] Game-" + game.gID);
    }
  }

  createGameHandler(socket, _){
    // generate game ID
    while(true){
      var gID = ID.genID(8);
      if(!this.games.map(g => g.gID).includes(gID)) break;
    }

    //instanciate game
    this.games.push(new game(gID));

    // send gameID to player
    socket.emit("createResult", { successful: true, gID });

    console.log("[+] Game-" + gID);

    //add host to game
    this.joinGameHandler(socket, gID);
  }

  joinGameHandler(socket, gID){

    // check if player already in game
    if(socket.gID != null) return socket.emit("joinResult", { successful: false, reason: "Already in a game" });
    
    //get game instance
    let game = this.getGameByID(gID);
    if(game == undefined) {
      return socket.emit("joinResult", { successful: false, reason: "Game does not exist" });
    }

    game.addPlayer(socket.pID);

    //set gID to game 
    socket.gID = gID;

    // send result to player
    socket.emit("joinResult", { successful: true });

    if(game.runData.players.length == 1) return console.log(`[~HOST] Player-${socket.pID} --> Game-${gID}`);
    console.log(`[~PLAYER] Player-${socket.pID} --> Game-${gID}`);
  }

  inputHandler(socket, dir){

    if(socket.gID == null) return;

    // get game instance
    let game = this.getGameByID(socket.gID);
    if(game == undefined) return;

    //check if player is in game
    if(!this.isPlayerInGame(socket.pID, socket.gID)) return socket.gID = null;

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