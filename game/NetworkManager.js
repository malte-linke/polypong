const { io } = require('socket.io-client');
var game = require('./Game');
var utils = require('./utils');

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

    this.init();
  }


  init(){
    this.server.on('connection', (socket) => {
      this.auth(socket);
      
      socket.on("join", (data) => this.joinGameHandler(socket, data));
      socket.on("leave", (data) => this.leaveGameHandler(socket, data));
      socket.on("create", (data) => this.createGameHandler(socket, data));
      socket.on("disconnect", (data) => this.disconnectHandler(socket, data));
    });
  }

  auth(socket){
    // Generate Random Player ID
    while(true){
      var pID = utils.genID(8);
      if(!this.players.map(p => p.pID).includes(pID)) break;
    }

    socket.pID = pID;
    socket.gID = null;

    this.players.push(socket);

    console.log("[+] Player-" + pID);
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
      var gID = utils.genID(8);
      if(!this.games.map(g => g.gID).includes(gID)) break;
    }

    //instanciate game
    this.games.push(new game(gID, socket.pID));

    socket.gID = gID;

    // send gameID to player
    socket.emit("createResult", { successful: true, gID });

    console.log("[+] Game-" + gID);
  }

  joinGameHandler(socket, gID){
    
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

    console.log(`[~] Player-${socket.pID} --> Game-${gID}`);
  }

  inputHandler(){
    // get game instance
    // send playerID and movement 
  }


  //
  // Helper Functions
  //
  getGameByID(gID){
    return this.games.find(game => game.gID == gID);    
  }
}