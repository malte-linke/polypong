class Renderer {

  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");

    window.addEventListener("resize", this.resize.bind(this));

    this.resize();


    this.clearColor = "black";
    this.backgroundImage = document.querySelector("#background");

    this.mapRadius = 0.5;

    this.ballParticleEmitters = [];

    this.notifications = [];
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

    
    // center polygon
    if(runData.players.length % 2 != 0){
      let circumradius = 0.5;
      let inradius = 0.5 * Math.cos(Math.PI / runData.players.length);

      let totalWidth = (circumradius + inradius) * this.size;

      var marginToWall = (this.size - totalWidth) / 2;

      //translate canvas to left
      this.ctx.translate(0, marginToWall);
    }

    this.darkenPlayingField(runData.players);


    // notifications
    this.renderNotifications();


    // get rotation angle so that player is always at the bottom
    let angle = this.getPlayerToBottomRotationAngle(runData.players);

    // rotate canvas
    this.rotateCanvas(angle);


    // draw
    this.drawMap(runData.players.length);
    this.drawBalls(runData);
    this.drawPlayers(runData.players);

    
    // reset canvas
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  drawMap(numPlayers){

    let vertices = PMath.getPolygonVertices(numPlayers, this.mapRadius, this.size);

  
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

      //this.ctx.fill();
      this.ctx.closePath();


      //draw particles

      if(balls.length < this.ballParticleEmitters.length){
        this.ballParticleEmitters.splice(balls.length, this.ballParticleEmitters.length - balls.length);
      }

      if(balls.length > this.ballParticleEmitters.length){
        for(let i = this.ballParticleEmitters.length; i < balls.length; i++){
          this.ballParticleEmitters.push(new ParticleEmitter(document.querySelector("canvas"), {
            particleLifeTime: 50,
            maxParticles: 100,
            particleSizeStart: 15,
            particleSizeEnd: 1,
            particleColorStart: {r: 0, g: 255, b: 255, a: 255},
            particleColorEnd: {r: 0, g: 0, b: 255, a: 255},
            particleSpeedStart: 1,
            particleSpeedEnd: 1,
            particleDirection: 0,
            particleSpread: 100,
            emitterSize: 0,
            emitterSpeed: 1,
            emitterPosition: {x: -300, y: -300}
          }));
        }
      }

      let angle = Vec2.getAngle({x: 0, y: -1}, runData.balls[i].velocity);
      let polygonSideLength = PMath.getPolygonSideLength(runData.players.length, 0.5);
      this.ballParticleEmitters[i].particleSizeStart = game.runData.balls[i].radius * this.size * polygonSideLength;
      this.ballParticleEmitters[i].particleDirection = angle + 180;
      this.ballParticleEmitters[i].emitterPosition = {x: game.runData.balls[i].position.x * this.size, y: game.runData.balls[i].position.y * this.size};

      this.ballParticleEmitters[i].update();
      this.ballParticleEmitters[i].draw();
    }
  }

  drawPlayers(players){    
    this.ctx.fillStyle = "#fff";
    let vertices = PMath.getPlayerRectVertices(players, this.size);

    for(let i = 0; i < vertices.length; i+=4){
      this.drawRect(vertices[i], vertices[i+1], vertices[i+2], vertices[i+3]);
    }
  }


  displayPlayerNotification(text){
    this.notifications.forEach(notif => {
      notif.position.y -= 30;
    });
    
    this.notifications.push({text: text.toUpperCase(), frame: 0, opacity: 1, position: {x: this.canvas.width/2, y: this.canvas.height/2}});
  }

  renderNotifications(){

    // Update 
    this.notifications.forEach(notif => {
      notif.frame++;
      
      if(notif.frame > 100){
        notif.opacity -= 0.02;
      }
    });

    // Remove if finished
    this.notifications = this.notifications.filter(notif => notif.opacity > 0);

    // Render
    this.ctx.font = "15px 'Press Start 2P', cursive"
    this.ctx.textAlign = "center";
    this.notifications.forEach(notif => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${notif.opacity})`;
      this.ctx.fillText(notif.text, notif.position.x, notif.position.y);
    });
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

  darkenPlayingField(players){

    let angle = this.getPlayerToBottomRotationAngle(players);

    let vertices = PMath.getPolygonVertices(players.length, this.mapRadius, this.size);

    this.rotateCanvas(angle);

    // make playing field darker
    this.ctx.strokeStyle = "#000";
    this.ctx.fillStyle = "#000";
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

    this.rotateCanvas(-angle);
  }

  getPlayerToBottomRotationAngle(players){
    let playerIndex = players.indexOf(players.find(p => p.self));
    return PMath.getPlayerToBottomRotationAngle(playerIndex, players.length);
  }
}