class Renderer {

  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");

    window.addEventListener("resize", this.resize.bind(this));

    this.resize();


    this.clearColor = "black";
    this.backgroundImage = document.querySelector("#background");
  }


  //
  // DRAWING
  //
  render(runData){
    // clear canvas
    this.ctx.fillStyle = this.clearColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if(runData == null) return;


    // draw background
    this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    
    // get rotation angle so that player is always at the bottom
    let playerIndex = runData.players.indexOf(runData.players.find(p => p.pID == "you"));
    let angle = PMath.getPlayerToBottomRotationAngle(playerIndex, runData.players.length, this.size)

    // rotate canvas
    this.rotateCanvas(angle);

    // draw
    this.drawMap(runData.players.length);
    this.drawBalls(runData);
    this.drawPlayers(runData.players);

    // reset rotation
    this.rotateCanvas(-angle);
  }

  drawMap(numPlayers){

    let r = 0.5;
    let vertices = PMath.getPolygonVertices(numPlayers, r, this.size);

  
    // draw polygon
    this.ctx.strokeStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0].x, vertices[0].y);

    for(let i = 1; i < vertices.length; i++){
      this.ctx.lineTo(vertices[i].x, vertices[i].y);
    }

    this.ctx.lineTo(vertices[0].x, vertices[0].y);

    this.ctx.stroke();
    this.ctx.closePath();


    // make playing field darker
    this.ctx.strokeStyle = "#000";
    this.ctx.globalAlpha = 0.8
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0].x, vertices[0].y);

    for(let i = 1; i < vertices.length; i++){
      this.ctx.lineTo(vertices[i].x, vertices[i].y);
    }

    this.ctx.lineTo(vertices[0].x, vertices[0].y);

    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.globalAlpha = 1
  }

  drawBalls(runData){

    let balls = runData.balls;

    for(let i = 0; i < balls.length; i++){

      let vertices = PMath.getBallPolygonVertices(runData.players, balls[i], this.size);

      // add current ball position to vertices
      vertices.forEach(vertex => {
        vertex.x += (balls[i].position.x - 0.5) * this.size;
        vertex.y += (balls[i].position.y - 0.5) * this.size;
      });

      // draw vertices
      this.ctx.fillStyle = "#fff";
      this.ctx.beginPath();
      this.ctx.moveTo(vertices[0].x, vertices[0].y);

      for(let i = 1; i < vertices.length; i++){
        this.ctx.lineTo(vertices[i].x, vertices[i].y);
      }

      this.ctx.lineTo(vertices[0].x, vertices[0].y);

      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  drawPlayers(players){    
    this.ctx.fillStyle = "#fff";
    let vertices = PMath.getPlayerRectVertices(players, this.size);

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