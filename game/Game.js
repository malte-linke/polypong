const { Collision, PMath, Vec2, Objects } = require('./Utils.js');

module.exports = class Game {
  constructor(gID, host = null){ //TODO: implement host
    this.gID = gID;
    this.host = host;
    this.players = [];

    this.playerSpeed = 0.02; 

    this.phase = "lobby";

    this.runData = {
      players : [],
      balls : [],
    };
  }

  update(){
    this.checkCollisions();
    this.applyVelocity();
  }

  applyVelocity(){

    //update players
    this.runData.players.forEach(p => {
      //update positions
      p.position += p.velocity * this.playerSpeed;
      
      //restrict player position
      if(p.position + p.size > 1){
        p.position = 1 - p.size;
      }
      if(p.position < 0){
        p.position = 0;
      }
    });

    //update balls
    this.runData.balls.forEach(b => {
      b.position.x += b.velocity.x;
      b.position.y += b.velocity.y;
    });
  }

  checkCollisions(){
    //get all vertices
    let polygonVertices = PMath.getPolygonVertices(this.runData.players.length, 0.5);
    let playerVertices = PMath.getPlayerRectVertices(this.runData.players);

    // get future player run data
    let playerRunData = Objects.clone(this.runData.players); 
    playerRunData.forEach(player => {
      player.position += player.velocity * this.playerSpeed;
    });

    let playerVerticesFuture = PMath.getPlayerRectVertices(playerRunData);


    this.runData.balls.forEach(b => {    

      let ball = {x: b.position.x, y: b.position.y, radius: b.radius};
      let ballFuture = {x: b.position.x + b.velocity.x, y: b.position.y + b.velocity.y, radius: b.radius};

      //check if intersects with player
      while(playerVertices.length > 0){

        // get only vertices for current player being checked
        let currentPlayerVertices = playerVertices.splice(0, 4);
        let currentPlayerVerticesFuture = playerVerticesFuture.splice(0, 4);
        
        if(Collision.areCircleRectIntersectingPredictive(currentPlayerVertices, currentPlayerVerticesFuture, ball, ballFuture)){  
          // set ball velocity to reflect off player
          b.velocity = Vec2.getReflectionVector(b.velocity, Vec2.subtract(currentPlayerVertices[1], currentPlayerVertices[0]));
          return;
        }
      }
      

      //check if intersects with game border
      for(let i = 0; i < polygonVertices.length; i++){
        let vertex = polygonVertices[i];
        let nextVertex = (i == polygonVertices.length - 1) ? polygonVertices[0] : polygonVertices[i+1];

        let line = {x1: vertex.x, y1: vertex.y, x2: nextVertex.x, y2: nextVertex.y};

        if(Collision.areCircleLineIntersectingPredictive(line, ball, ballFuture)){
          b.position.x = 0.5;
          b.position.y = 0.5;

          //b.velocity = {x: 0.01, y: -0.002};
        }
      }


      //check if out of bounds
      if(b.position.x < 0 || b.position.x > 1 || b.position.y < 0 || b.position.y > 1){
        b.position.x = 0.5;
        b.position.y = 0.5;
      }
    });
  }

  start(){

  }


  close(){
    //TODO: kick every player and send server close message
//TODO: maybe give reason to what happened to other players
  }

  getRunData(){
    return this.runData;
  }


  handlePlayerInput(pID, dir){
    //set velocity to player
    if(dir == "a") dir = 1;
    else if(dir == "d") dir = -1;
    else dir = 0;

    this.runData.players.find(p => p.pID == pID).velocity = dir;
  }


  addPlayer(pID, isHost){
    if(isHost) this.host = { pID };
    else this.players.push({ pID })
    this.runData.players.push({ position: 0.25, size: 0.25, velocity: 0, pID });

    if(this.players.length + 1 == 3){
      this.runData.balls.push({ 
        position: {x: 0.5, y: 0.5} ,
        velocity: {x: 0.01, y: -0.0025},
        radius: 0.01
      });
    }
  }


  removePlayer(pID){
    
    //TODO: implement host migration and only close if no host left
    if(this.host == pID) return true; // Return if game should close
       
    this.players = this.players.filter(p => p.pID != pID);
    this.runData.players = this.runData.players.filter(p => p.pID != pID);
    return false;
  }
}