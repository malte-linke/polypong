const { Collision, PMath, Vec2, Objects } = require('./Utils.js');

module.exports = class Game {
  constructor(gID){
    this.gID = gID;

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


    for(let j = 0; j < this.runData.balls.length; j++){   

      let b = this.runData.balls[j];

      let ball = {x: b.position.x, y: b.position.y, radius: b.radius};
      let ballFuture = {x: b.position.x + b.velocity.x, y: b.position.y + b.velocity.y, radius: b.radius};

      let ballCollided = false;

      //check if intersects with player
      for(let i = 0; i < playerVertices.length; i+=4){

        // get only vertices for current player being checked
        let currentPlayerVertices = playerVertices.slice(i , i+4);
        let currentPlayerVerticesFuture = playerVerticesFuture.slice(i, i+4);
        
        if(Collision.areCircleRectIntersectingPredictive(currentPlayerVertices, currentPlayerVerticesFuture, ball, ballFuture)){  
          ballCollided = true;
          if(b.lastCollision == this.runData.players[i/4].pID) continue;    
          
          b.velocity = Vec2.getReflectionVector(b.velocity, Vec2.subtract(playerVertices[i+1], playerVertices[i]));
          b.lastCollision = this.runData.players[i/4].pID;
          return;
        }
      }

      if(!ballCollided) b.lastCollision = null;
      
      //check if intersects with game border
      for(let i = 0; i < polygonVertices.length; i++){
        let vertex = polygonVertices[i];
        let nextVertex = (i == polygonVertices.length - 1) ? polygonVertices[0] : polygonVertices[i+1];

        let line = {x1: vertex.x, y1: vertex.y, x2: nextVertex.x, y2: nextVertex.y};

        if(Collision.areCircleLineIntersectingPredictive(line, ball, ballFuture)){
          b.position.x = 0.5;
          b.position.y = 0.5;
          return;
        }
      }


      //check if out of bounds
      if(b.position.x < 0 || b.position.x > 1 || b.position.y < 0 || b.position.y > 1){
        b.position.x = 0.5;
        b.position.y = 0.5;
      }
    }
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


  addPlayer(pID){
    let isHost = this.runData.players.length <= 0 ? true : false;
    this.runData.players.push({ position: 0.375, size: 0.25, velocity: 0, pID, isHost });

    if(this.runData.players.length == 3){
      this.runData.balls.push({ 
        position: {x: 0.5, y: 0.5} ,
        velocity: {x: 0.008, y: -0.004},
        radius: 0.01,
        lastCollision: null
      });
    }

    if(this.runData.players.length == 5){
      this.runData.balls.push({ 
        position: {x: 0.5, y: 0.5} ,
        velocity: {x: -0.008, y: 0.004},
        radius: 0.01,
        lastCollision: null
      });
    }
  }


  removePlayer(pID){
    
    //TODO: implement host migration and only close if no host left
    this.runData.players = this.runData.players.filter(p => p.pID != pID);

    // remove ball if less than 3 players left
    if(this.runData.players.length < 3) this.runData.balls = [];

    // Return if game should close
    if(this.runData.players.length <= 0) return true; 
    if(this.runData.players.find(p => p.isHost) == undefined) return true; 
    return false;
  }
}