class ParticleEmitter {

  constructor(canvas, options = {}){

    // Canvas
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.particles = [];

    // Particle Options
    this.particleLifeTime = options.particleLifeTime || 100;
    this.maxParticles = options.maxParticles || 100;
    this.particleSizeStart = options.particleSizeStart || 5;
    this.particleSizeEnd = options.particleSizeEnd || 5;

    this.particleColorStart = options.particleColorStart || {r: 255, g: 255, b: 255, a: 255};
    this.particleColorEnd = options.particleColorEnd || {r: 255, g: 255, b: 255, a: 255};

    this.particleSpeedStart = options.particleSpeedStart || 1;
    this.particleSpeedEnd = options.particleSpeedEnd || 1;

    this.particleDirection = options.particleDirection || 0;
    this.particleSpread = options.particleSpread || 0;

    // Emitter Options
    this.emitterSize = options.emitterSize || 1;
    this.emitterSpeed = options.emitterSpeed || 1;
    this.emitterPosition = options.emitterPosition || {x: 300, y: 300};

    this.lastParticle = Date.now();
  }

  createParticle(){

    let velocity = {x: 0, y: -this.particleSpeedStart};

    // Rotate in particleDirection
    velocity = this.#Vec2.rotate(velocity, this.particleDirection);

    // Add spread to velocity
    velocity = this.#Vec2.rotate(velocity, Math.random() * this.particleSpread - this.particleSpread / 2);

    // calculate position (random point in the emitter sphere)
    let r = this.emitterSize * Math.sqrt(Math.random());
    let theta = Math.random() * 2 * Math.PI;

    let x = this.emitterPosition.x + r * Math.cos(theta);
    let y = this.emitterPosition.y + r * Math.sin(theta);

    this.particles.push({
      lifeTime: this.particleLifeTime,
      velocity: {x: velocity.x, y: velocity.y},
      position: {x, y},
      size: this.particleSizeStart,
      color: this.particleColorStart
    });
  }

  update(){

    //create new particle if there are less than maxParticles and the time since last particle is greater than emitterSpeed
    if(this.particles.length < this.maxParticles && Date.now() - this.lastParticle > this.emitterSpeed){
      this.createParticle();
      this.lastParticle = Date.now();
    }


    this.particles.forEach((particle, index) => {

      // Delete particle if it's lifeTime is over
      if(particle.lifeTime <= 0){
        this.particles.splice(index, 1);
      }

      // update particle size
      particle.size = this.particleSizeStart + (this.particleSizeEnd - this.particleSizeStart) 
        * (this.particleLifeTime - particle.lifeTime) / this.particleLifeTime;

      // Update particle velocity
      let particleAngle = this.#Vec2.getAngle(particle.velocity, {x: 0, y: -1});
      let particleSpeed = this.particleSpeedStart + (this.particleSpeedEnd - this.particleSpeedStart) 
        * (this.particleLifeTime - particle.lifeTime) / this.particleLifeTime;

      particle.velocity = {x: 0, y: -particleSpeed};
      particle.velocity = this.#Vec2.rotate(particle.velocity, -particleAngle);

      // update particle color
      particle.color = this.#Color.rgbaFade(
        this.particleColorStart, 
        this.particleColorEnd, 
        (this.particleLifeTime - particle.lifeTime) / this.particleLifeTime
      );

      // Update particle position
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;

      // Update particle lifeTime
      particle.lifeTime -= 1;
    });
  }

  draw(){
    this.particles.forEach((particle) => {
      this.ctx.beginPath();

      this.ctx.fillStyle = 
        `rgba(
          ${particle.color.r},
          ${particle.color.g},
          ${particle.color.b},
          ${particle.color.a / 255}
        )`;

      this.ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
      // draw rect
      //this.ctx.fillRect(particle.position.x - particle.size / 2, particle.position.y - particle.size / 2, particle.size, particle.size);
      this.ctx.fill();
      this.ctx.closePath();
    });
  }



  #Vec2 = {
    rotate(v, angle){
      //convert to radians
      angle = angle * Math.PI / 180;
      const x = v.x * Math.cos(angle) - v.y * Math.sin(angle);
      const y = v.x * Math.sin(angle) + v.y * Math.cos(angle);
  
      return {x, y};
    },
  
    getAngle (v1, v2) {
      // return angle between two vectors in degrees
      let dot = v1.x * v2.x + v1.y * v2.y; // dot product
      let det = v1.x * v2.y - v1.y * v2.x; // determinant
      let angle = Math.atan2(det, dot); // atan2(y, x) or atan2(sin, cos)
      return angle * 180 / Math.PI;
    }
  }
  
  #Color = {
    rgbaFade(prevRGBA, nextRGBA, amount){
      let newR = prevRGBA.r + (nextRGBA.r - prevRGBA.r) * amount;
      let newG = prevRGBA.g + (nextRGBA.g - prevRGBA.g) * amount;
      let newB = prevRGBA.b + (nextRGBA.b - prevRGBA.b) * amount;
      let newA = prevRGBA.a + (nextRGBA.a - prevRGBA.a) * amount;
  
      return {r: newR, g: newG, b: newB, a: newA};
    }
  }
}


