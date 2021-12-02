class Renderer {

  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");
    this.runData = null;

    window.addEventListener("resize", this.resize.bind(this));

    this.resize();
  }

  setRunData(runData){
    this.runData = runData;
  }

  //
  // DRAWING
  //
  render(){
    // clear canvas
    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //TODO: rotate so player is on bottom

    // draw
    if(this.runData == null) return;
    this.drawMap(this.runData.players.length);
    this.drawBalls(this.runData.balls);
    this.drawPlayers(this.runData.players);
  }
  
  drawMap(numPlayers){

    let r = 0.5;
    let vertices = getPolygonVertices(numPlayers, r, this.size);

    // draw vertices
    this.ctx.strokeStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0].x, vertices[0].y);

    for(let i = 1; i < vertices.length; i++){
      this.ctx.lineTo(vertices[i].x, vertices[i].y);
    }

    this.ctx.lineTo(vertices[0].x, vertices[0].y);

    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawBalls(balls){
    for(let i = 0; i < balls.length; i++){
      this.ctx.fillStyle = "#fff";
      this.ctx.beginPath();
      this.ctx.arc(balls[i].position.x * this.size, balls[i].position.y * this.size, this.size * balls[i].radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  drawPlayers(players){    
    this.ctx.fillStyle = "#fff";

    let vertices = getPlayerRectVertices(players, this.size);

    for(let i = 0; i < vertices.length; i+=4){
      this.drawRect(vertices[i], vertices[i+1], vertices[i+2], vertices[i+3]);
    }
    
    /*
    this.ctx.fillStyle = "red";

    vertices.forEach(vertex => {
      this.ctx.beginPath();
      this.ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
    });
    
    */
    /*
    for(let i = 0; i < players.length; i++){

      let playerHeightFactor = 30;

      let playerSize = polygonSideLength * players[i].size;
      let playerHeight =  polygonSideLength / playerHeightFactor;
      let playerX = (players[i].position * polygonSideLength) + distanceToLeftPolygonVertex;
      let playerY = (this.size / 2 - polygonSideDistance - (polygonSideLength / playerHeightFactor) / 2);
      //TODO: fix rotation
      this.ctx.fillStyle = "#fff";
      this.ctx.fillRect(playerX, playerY, playerSize,playerHeight);

      //console.log(playerX, playerY, playerSize,playerHeight);
      
      this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
      this.ctx.rotate(rotationDeg * Math.PI / 180);
      this.ctx.translate(-this.canvas.width/2, -this.canvas.height/2);
    }
    */
  }

  

  //
  // EVENTS
  //
  resize(){
    let canvasSize = Math.min(window.innerWidth, window.innerHeight);
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;

    this.size = canvasSize;
  }



  //
  // HELPER
  //
  rotateCanvas(context, angle){
    this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
    this.ctx.rotate(angle * Math.PI / 180);
    this.ctx.translate(-this.canvas.width/2, -this.canvas.height/2);
  }


  drawRect(a, b, c, d, col){
    this.ctx.fillStyle = col;
    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);
    this.ctx.lineTo(b.x, b.y);
    this.ctx.lineTo(c.x, c.y);
    this.ctx.lineTo(d.x, d.y);
    this.ctx.lineTo(a.x, a.y);
    this.ctx.fill();
    this.ctx.closePath();
  }
}

/*

  let r = 0.5;
  let n = numPlayers;

  let vertices = getPolygonVertices(n, r, this.size);

  let points = getTwoHighestVertices(vertices);

  // get middle point between two highest vertices
  let middlePoint = {
    x: (points[0].x + points[1].x) / 2,
    y: (points[0].y + points[1].y) / 2
  };

  // get vectors to calculate angle
  let vec1 = {x: 0, y: 1};
  let vec2 = {
    x: middlePoint.x - this.size/2,
    y: middlePoint.y - this.size/2
  };

  let rotationOffset = Vec2.getAngle(vec1, vec2);

  // rotate canvas according to rotation offset to always get flat side up
  //this.rotateCanvas(rotationOffset);


    //DRAW ------------------------------


  //rotate canvas back
  //this.rotateCanvas(-rotationOffset);

*/