const { Collision, PMath, Vec2, Objects } = require('./Utils.js');

module.exports = class Game {
  constructor(gID, host = null){ //TODO: implement host
    this.gID = gID;
    this.host = host;
    this.players = [];

    this.playerSpeed = 0.02; 

    this.phase = "lobby";

    this.runData = {
      players : [
        { position: 0, size: 1, velocity: 0, pID: 0 },
        { position: 0, size: 1, velocity: 0, pID: 1 },
        { position: 0, size: 1, velocity: 0, pID: 2 },
        { position: 0, size: 1, velocity: 0, pID: 0 },
      ],
      balls : [
        { 
          position: {x: 0.5, y: 0.5} ,
          velocity: {x: 0.08, y: -0.02},
          radius: 0.01
        } 
      ],
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


    this.runData.balls.forEach(b => {    

      //get future ball position
      let bPos = { x: b.position.x, y: b.position.y };
      let bPosFuture = {x: b.position.x + b.velocity.x, y: b.position.y + b.velocity.y};

      
      //check if intersects with player
      for(let i = 0; i < playerVertices.length; i+=4){

        //console.log(`Checked for player ${i/4}`);

        // get future player run data
        let playerRunData = Objects.clone(this.runData.players); 
        playerRunData.forEach(player => {
          player.position += player.velocity * this.playerSpeed;
        });
        

        // get current and future player and ball locations
        let rectVertices = [playerVertices[i], playerVertices[i+1], playerVertices[i+2], playerVertices[i+3]];
        let rectVerticesFuture = PMath.getPlayerRectVertices(playerRunData);
        rectVerticesFuture = [rectVerticesFuture[i], rectVerticesFuture[i+1], rectVerticesFuture[i+2], rectVerticesFuture[i+3]];
        let circle = {x: b.position.x, y: b.position.y, radius: b.radius};
        let circleFuture = {x: b.position.x + b.velocity.x, y: b.position.y + b.velocity.y, radius: b.radius};

        if(Collision.areCircleRectIntersectingPredictive(rectVertices, rectVerticesFuture, circle, circleFuture)){  
          // set ball velocity to reflect off player
          b.velocity = Vec2.getReflectionVector(b.velocity, Vec2.subtract(playerVertices[i+1], playerVertices[i]));
          return;
        }
      }
      

      //check if intersects with game border
      for(let i = 0; i < polygonVertices.length; i++){
        let vertex = polygonVertices[i];
        let nextVertex = (i == polygonVertices.length - 1) ? polygonVertices[0] : polygonVertices[i+1];

        if(Collision.areCircleLineIntersecting(vertex.x, nextVertex.x, vertex.y, nextVertex.y, bPos.x, bPos.y, b.radius)){
          b.position.x = 0.5;
          b.position.y = 0.5;

          b.velocity = {x: 0.01, y: -0.002};
        }
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
  }


  removePlayer(pID){
    
    //TODO: implement host migration and only close if no host left
    if(this.host == pID) return true; // Return if game should close
       
    this.players = this.players.filter(p => p.pID != pID);
    this.runData.players = this.runData.players.filter(p => p.pID != pID);
    return false;
  }
}