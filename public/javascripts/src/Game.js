/**
 * Handles the client game simulation
 */
 class Game{

  constructor(){
    this.runData = null;
    this.playerSpeed = 0.02;
  }

  update(deltaTimeFactor){
    if(this.runData == null) return;

    this.checkCollisions(deltaTimeFactor);
    this.applyVelocities(deltaTimeFactor);
  }

  applyVelocities(deltaTimeFactor){

    //update players
    this.runData.players.forEach((p, i) => {
      //update positions
      p.position += (p.velocity * 0.02) * deltaTimeFactor;
    
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
    let polygonVertices = PMath.getPolygonVertices(this.runData.players.length, 0.5, 1);
    let playerVertices = PMath.getPlayerRectVertices(this.runData.players, 1);

    // get future player run data
    let playerRunData = Objects.clone(this.runData.players); 
    playerRunData.forEach(player => {
      player.position += player.velocity * 0.02 * deltaTimeFactor;
    });

    let playerVerticesFuture = PMath.getPlayerRectVertices(playerRunData, 1);


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
          if(b.lastCollision == i/4) continue;    
          
          b.velocity = Vec2.getReflectionVectorAdvanced(currentPlayerVertices, b, i/4, playerRunData.length);
          b.lastCollision = i/4;
          sound.play("player_hit"); 
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
          sound.play("enemy_hit");
          return;
        }
      }


      //check if out of bounds
      if(b.position.x < 0 || b.position.x > 1 || b.position.y < 0 || b.position.y > 1){
        b.position.x = 0.5;
        b.position.y = 0.5;
        sound.play("enemy_hit"); 
      }
    }
  }
}