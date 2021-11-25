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

    console.log("[+] Player" + pID);
  }


  disconnectHandler(socket, data){
    // remove from current game
    if(socket.gID != null){
      let game = getGameByID(socket.gID);
      //TODO: disconnect player from game
      // maybe give reason to what happened to other players
    }

    // remove from players array
    this.players.splice();

    console.log("[-] Player" + socket.pID);
  }


  getGameByID(gID){
    return this.games.find(game => game.gID === gID);
  }

  createGameHandler(socket, query){
    while(true){
      var gID = utils.genID(8);
      if(!this.games.map(g => g.gID).includes(gID)) break;
    }

    //Create Game Instance
    //Set player gID        // all in one constructor?
    //make player host
    //Send invite id (gameid?)
  }

  joinGameHandler(socket, query){
    console.log(`Player ${socket.pID} ==> Game ${query}`);

    //set gID to game 
    //add player to game instance
  }

  handleInput(){
    // get game instance
    // send playerID and movement 
  }
}