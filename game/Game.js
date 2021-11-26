module.exports = class Game {
  constructor(gID, host = null){ //TODO: implement host
    this.gID = gID;
    this.host = host;
    this.players = [];

    this.phase = "lobby";
    
  }


  start(){

  }


  close(){
    //TODO: kick every player and send server close message
//TODO: maybe give reason to what happened to other players
  }


  handlePlayerInput(){

  }


  addPlayer(pID){
    this.players.push({ pID });
  }


  removePlayer(pID){
    
    //TODO: implement host migration and only close if no host left
    if(this.host == pID) return true; // Return if game should close
       
    this.players = this.players.filter(p => p.pID != pID);
    return false;
  }
}