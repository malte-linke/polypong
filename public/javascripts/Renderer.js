class Renderer {

  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");
    this.runData = null;

    window.addEventListener("resize", this.resize.bind(this));

    this.resize();


    this.background = "black";
  }

  setRunData(runData){
    this.runData = runData;
  }

  //
  // DRAWING
  //
  render(){
    // clear canvas
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if(this.runData == null || this.runData.players.length < 3) return;

    //TODO: get rotation angle to place player at bottom


    //this.rotateCanvas(rotationDeg);

    // draw
    this.drawMap(this.runData.players.length);
    this.drawBalls(this.runData.balls);
    this.drawPlayers(this.runData.players);

    // reset rotation
    //this.rotateCanvas(-rotationDeg);
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
  rotateCanvas(angle){
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