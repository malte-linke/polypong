const { Collision, PMath, Vec2, Objects } = require('./Utils.js');

module.exports = class Game {
  constructor(gID){
    this.gID = gID;

    this.playerSpeed = 0.02; 
    this.phase = "lobby";
    this.hasNewRunData = false;

    this.runData = {
      players : [],
      balls : [],
    };
  }

  update(deltaTimeFactor){
    this.checkCollisions(deltaTimeFactor);
    this.applyVelocities(deltaTimeFactor);
  }

  applyVelocities(deltaTimeFactor){

    //update players
    this.runData.players.forEach((p, i) => {
      //update positions
      p.position += (p.velocity * this.playerSpeed) * deltaTimeFactor;
    
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
      b.position.x += b.velocity.x * deltaTimeFactor;
      b.position.y += b.velocity.y * deltaTimeFactor;
    });
  }

  checkCollisions(deltaTimeFactor){
    //get all vertices
    let polygonVertices = PMath.getPolygonVertices(this.runData.players.length, 0.5);
    let playerVertices = PMath.getPlayerRectVertices(this.runData.players);

    // get future player run data
    let playerRunData = Objects.clone(this.runData.players); 
    playerRunData.forEach(player => {
      player.position += player.velocity * this.playerSpeed * deltaTimeFactor;
    });

    let playerVerticesFuture = PMath.getPlayerRectVertices(playerRunData);


    for(let j = 0; j < this.runData.balls.length; j++){   

      let b = this.runData.balls[j];

      let polygonSideLength = PMath.getPolygonSideLength(this.runData.players.length, 0.5);

      let ball = {x: b.position.x, y: b.position.y, radius: b.radius * polygonSideLength};
      let ballFuture = {x: b.position.x + b.velocity.x * deltaTimeFactor, y: b.position.y + b.velocity.y * deltaTimeFactor, radius: b.radius * polygonSideLength};

      let ballCollided = false;

      //check if intersects with player
      for(let i = 0; i < playerVertices.length; i+=4){

        // get only vertices for current player being checked
        let currentPlayerVertices = playerVertices.slice(i , i+4);
        let currentPlayerVerticesFuture = playerVerticesFuture.slice(i, i+4);
        
        if(Collision.areCircleRectIntersectingPredictive(currentPlayerVertices, currentPlayerVerticesFuture, ball, ballFuture)){  
          ballCollided = true;
          this.hasNewRunData = true;
          if(b.lastCollision == i/4) continue;    
          
          b.velocity = Vec2.getReflectionVectorAdvanced(currentPlayerVertices, b, i/4, playerRunData.length);
          b.lastCollision = i/4;
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
          this.hasNewRunData = true;
          return;
        }
      }


      //check if out of bounds
      if(b.position.x < 0 || b.position.x > 1 || b.position.y < 0 || b.position.y > 1){
        b.position.x = 0.5;
        b.position.y = 0.5;
        this.hasNewRunData = true;
      }
    }
  }

  getNewRunData(){
    if(!this.hasNewRunData) return null;

    this.hasNewRunData = false;
    return this.runData;
  }

  handlePlayerInput(pID, dir){
    //set velocity to player
    if(dir == "a") dir = 1;
    else if(dir == "d") dir = -1;
    else dir = 0;

    this.runData.players.find(p => p.pID == pID).velocity = dir;
    this.hasNewRunData = true;
  }

  addPlayer(pID, index = -1){
    let isHost = this.runData.players.length <= 0 ? true : false;
    this.runData.players.splice(index, 0, { position: 0.375, size: 0.25, width: 0.05, velocity: 0, pID, isHost });
    this.onPlayerNumberChange(true);
    
    this.hasNewRunData = true;
  }

  removePlayer(pID){
    
    //TODO: implement host migration and only close if no host left
    this.runData.players = this.runData.players.filter(p => p.pID != pID);

    this.onPlayerNumberChange(false);
    this.hasNewRunData = true;

    // Return if game should close
    if(this.runData.players.length <= 0) return true; 
    if(this.runData.players.find(p => p.isHost) == undefined) return true; 
    return false;
  }

  onPlayerNumberChange(increased){

    /*
    EVERYTHING IN THIS METHOD IS FOR TESTING PURPOSES ONLY
    */

    let num = this.runData.players.filter(p => p.pID.length >= 3).length;

    if(num == 0) this.runData.balls = [];

    if(num == 1){
      //remove all walls
      this.runData.players = this.runData.players.filter(p => p.pID.length >= 3);
      this.addWall();
      this.addWall();
      this.addWall();


      //add ball
      this.addBall();
    }

    if(num == 2){
      //remove all walls
      this.runData.players = this.runData.players.filter(p => p.pID.length >= 3);
      this.addWall(1);
      this.addWall(3);
    }

    if(num == 3){
      //remove all walls
      this.runData.players = this.runData.players.filter(p => p.pID.length >= 3);
    }


    if(num == 5 && increased){
      this.addBall();
    }

    if(num == 5 && !increased){
      this.runData.balls.pop();
    }
  }

  addWall(index = -1){
    if(index == -1) index = this.runData.players.length;
    this.runData.players.splice(index, 0, { position: 0, size: 1, width: 0.05, velocity: 0, pID: "-", isHost: false });
  }

  addBall(){

    let velocity = {x: 0.008, y: -0.004};
    velocity = Vec2.rotate(velocity, Math.random() * 360);

    this.runData.balls.push(
      { 
      position: {x: 0.5, y: 0.5} ,
      velocity: velocity,
      radius: 0.02,
      lastCollision: null
      }
    )
  }
}