class Renderer {

  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");

    window.addEventListener("resize", this.resize.bind(this));
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));

    this.resize();
  }


  //
  // DRAWING
  //
  render(runData){
    // clear canvas
    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draw
    this.drawMap(runData.players.length);
    this.drawBalls(runData.balls);
    this.drawPlayers(runData.players);
  }
  
  drawMap(numPlayers){

    let r = 0.5;
    let n = numPlayers;

    let vertices = [];

    // calculate vertices
    for(let i = 0; i < numPlayers; i++){
      vertices.push({
        x: (r * Math.cos(2 * Math.PI * i / n) * this.size) + this.size/2, 
        y: (r * Math.sin(2 * Math.PI * i / n) * this.size) + this.size/2
      });
    }
    

    let points = this.getTwoHighestVertices(vertices);

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

    let rotationOffset = this.getVec2Angle(vec1, vec2);

    // rotate canvas according to rotation offset to always get flat side up
    this.rotateCanvas(rotationOffset);


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

    //rotate canvas back
    this.rotateCanvas(-rotationOffset);
  }

  drawBalls(ball){
    for(let i = 0; i < ball.length; i++){
      this.ctx.fillStyle = "#fff";
      this.ctx.beginPath();
      this.ctx.arc(ball[i].position.x * this.canvas.width, ball[i].position.y * this.canvas.height, this.size * ball[i].radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
    }
    
  }

  drawPlayers(players){    

    let rotationDeg = 360 / players.length;
    let polygonSideLength = this.getPolygonSideLength(0.5, players.length);
    let polygonSideDistance = this.getPolygonSideDistance(0.5, players.length);


    let playerOffsetY = this.size / 2
    
    this.ctx.fillStyle = "#fff";
    
    for(let i = 0; i < players.length; i++){

      let playerSize = polygonSideLength * players[i].size;
      let playerHeight =  polygonSideLength / 30;
      let playerX = (this.size/2 ) - (playerSize/2);
      let playerY = (this.size / 2 - polygonSideDistance - (polygonSideLength / 30) / 2);
      //TODO: fix rotation
      //TODO: fix ball size
      this.ctx.fillStyle = "#fff";
      this.ctx.fillRect(playerX, playerY, playerSize,playerHeight);
      
      this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
      this.ctx.rotate(rotationDeg * Math.PI / 180);
      this.ctx.translate(-this.canvas.width/2, -this.canvas.height/2);
    }
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

  keyDown(event){

  }

  keyUp(event){
  
  }


  //
  // HELPER
  //
  rotateCanvas(angle){
    this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
    this.ctx.rotate(angle * Math.PI / 180);
    this.ctx.translate(-this.canvas.width/2, -this.canvas.height/2);
  }

  getPolygonSideDistance(radius, numSides){
    //return (radius * Math.acos(Math.PI/numSides)); 
    //console.log(this.getPolygonSideLength(numSides, radius));
    return Math.sqrt(Math.pow(radius * this.size, 2) - Math.pow(this.getPolygonSideLength(radius, numSides) / 2, 2))
  }

  getPolygonSideLength(r, n){

    let p1 = {
      x: (r * Math.cos(2 * Math.PI * 0 / n) * this.size) + this.size/2, 
      y: (r * Math.sin(2 * Math.PI * 0 / n) * this.size) + this.size/2
    };
  
    let p2 = {
      x: (r * Math.cos(2 * Math.PI * 1 / n) * this.size) + this.size/2, 
      y: (r * Math.sin(2 * Math.PI * 1 / n) * this.size) + this.size/2
    };
  
    return this.getDistanceBetweenPoints(p1, p2);
  }

  getDistanceBetweenPoints(p1, p2){
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
  
    return Math.sqrt( a*a + b*b );
  }

  getTwoHighestVertices(vertices) {
    let highest = 0;
    let secondHighest = 0;

    for(let i = 0; i < vertices.length; i++){
      if(vertices[i].y < vertices[highest].y){
        secondHighest = highest;
        highest = i;
      } else if(vertices[i].y < vertices[secondHighest].y){
        secondHighest = i;
      }
    }

    return [vertices[highest], vertices[secondHighest]];
  }

  getVec2Angle(v1, v2){
    // return angle between two vectors in degrees
    let dot = v1.x * v2.x + v1.y * v2.y; // dot product
    let det = v1.x * v2.y - v1.y * v2.x; // determinant
    let angle = Math.atan2(det, dot); // atan2(y, x) or atan2(sin, cos)
    return angle * 180 / Math.PI;
  }
}
