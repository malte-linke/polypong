/**
 * Handles everything cookie related
 */
const Cookies = {
  get (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  
  
  set (cname, cvalue, exyears) {
    let d = new Date();
    d.setTime(d.getTime() + (exyears*24*60*60*1000*365));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
}


/**
 * Vector Stuff (2D only)
 */
const Vec2 = {

  add: (v1, v2) => {
    let vNewX = v1.x + v2.x;
    let vNewY = v1.y + v2.y;
  
    return {x: vNewX, y: vNewY};
  },

  subtract: (v1, v2) => {
    let vNewX = v1.x - v2.x;
    let vNewY = v1.y - v2.y;
  
    return {x: vNewX, y: vNewY};
  },

  dotProduct: (v1, v2) => {
    return v1.x * v2.x + v1.y * v2.y;
  },
  
  applyDirVec: (oVector, r, dirVector) => {
    let newX = oVector.x + (r * dirVector.x);
    let newY = oVector.y + (r * dirVector.y);
  
    return {x: newX, y: newY};
  },

  getAngle: (v1, v2) => {
    // return angle between two vectors in degrees
    let dot = v1.x * v2.x + v1.y * v2.y; // dot product
    let det = v1.x * v2.y - v1.y * v2.x; // determinant
    let angle = Math.atan2(det, dot); // atan2(y, x) or atan2(sin, cos)
    return angle * 180 / Math.PI;
  },

  getReflectionVector(v, n) {
    n = this.normalize(n);
    let d = this.dotProduct(v, n);
    return {x: v.x - 2 * d * n.x, y: v.y - 2 * d * n.y};
  },

  normalize (v)  {
    let len = Math.sqrt(v.x * v.x + v.y * v.y);
    return {x: v.x / len, y: v.y / len};
  }
}


/**
 * Handles all the polygon/vertices stuff for drawing and calculating
 */
const PMath = {

  getBallPolygonVertices(players, ball, canvasSize = 1) {
    // calculate circumradius
    let r = ball.radius / Math.cos(Math.PI / players.length);
    let polygonSideLength = PMath.getPolygonSideLength(players.length, 0.5);
    r *= polygonSideLength;

    return this.getPolygonVertices(players.length, r, canvasSize);
  },

  getPlayerRectVertices(players, canvasSize = 1){
  
    let vertices = [];
    let polygonVertices = this.getPolygonVertices(players.length, 0.5, canvasSize);
    let polygonSideLength = this.getPolygonSideLength(players.length, 0.5, 1);
    let playerHeightFactor = 30;
  
  
    for(let i = 0; i < players.length; i++){
  
      // Get vector of the players polygon side
      let oVectorSide, dirVectorSide;
  
      if(i == players.length - 1){
        oVectorSide = polygonVertices[i];
        dirVectorSide = Vec2.subtract(polygonVertices[0], polygonVertices[i]);
      }
      else{
        oVectorSide = polygonVertices[i];
        dirVectorSide = Vec2.subtract(polygonVertices[i+1], polygonVertices[i]);
      }
  
      // get the ortogonal vector of the side
      let ortogonalDirVectorSide = {x: -dirVectorSide.y, y: dirVectorSide.x};
      
      //calculate all corners of player
      let playerStartVertex = Vec2.applyDirVec(oVectorSide, players[i].position, dirVectorSide);
      let playerStartVertexLeft = Vec2.applyDirVec(playerStartVertex, players[i].width/2, ortogonalDirVectorSide);
      let playerStartVertexRight = Vec2.applyDirVec(playerStartVertex, -players[i].width/2, ortogonalDirVectorSide);
      let playerEndVertexLeft = Vec2.applyDirVec(playerStartVertexLeft, players[i].size, dirVectorSide);
      let playerEndVertexRight = Vec2.applyDirVec(playerStartVertexRight, players[i].size, dirVectorSide);
  
      vertices.push(playerStartVertexLeft, playerStartVertexRight, playerEndVertexRight, playerEndVertexLeft);
    }  
    
    return vertices;
  },
  
  
  getPolygonVertices(n, r, canvasSize = 1){
    let vertices = [];

    for(let i = 0; i < n; i++){
      vertices.push({
        x: (r * Math.cos(2 * Math.PI * i / n) * canvasSize) + canvasSize/2, 
        y: (r * Math.sin(2 * Math.PI * i / n) * canvasSize) + canvasSize/2
      });
    }
  
    return vertices;
  },
  
  
  getPolygonSideLength(n, r, canvasSize = 1){
  
    let p1 = {
      x: (r * Math.cos(2 * Math.PI * 0 / n) * canvasSize) + canvasSize/2, 
      y: (r * Math.sin(2 * Math.PI * 0 / n) * canvasSize) + canvasSize/2
    };
  
    let p2 = {
      x: (r * Math.cos(2 * Math.PI * 1 / n) * canvasSize) + canvasSize/2, 
      y: (r * Math.sin(2 * Math.PI * 1 / n) * canvasSize) + canvasSize/2
    };
    
    
    return this.getDistanceBetweenPoints(p1, p2);
  },
  
  
  getPolygonSideDistance(radius, numSides, canvasSize = 1){
    return Math.sqrt(Math.pow(radius * canvasSize, 2) - Math.pow(this.getPolygonSideLength(numSides, radius, canvasSize) / 2, 2))
  },
  
  
  getDistanceBetweenPoints(p1, p2){
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
  
    return Math.sqrt( a*a + b*b );
  },


  getPlayerToBottomRotationAngle(playerIndex, players, canvasSize = 1){
    let polygonVertices = PMath.getPolygonVertices(players, 0.5, canvasSize);
    let playerSideVertices = [];

    if(playerIndex == players - 1){
      playerSideVertices.push(polygonVertices[playerIndex]);
      playerSideVertices.push(polygonVertices[0]);
    }
    else playerSideVertices = polygonVertices.slice(playerIndex, (playerIndex) + 2);


    let v1 = Vec2.subtract(playerSideVertices[0], playerSideVertices[1]);
    let v2 = Vec2.subtract({x: 1, y: 0}, {x: 0, y: 0});

    return Vec2.getAngle(v1, v2);
  }
}


/**
 * Various object utility functions
 */
const Objects = {
  clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
  
    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.clone(obj[i]);
        }
        return copy;
    }
  
    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
        }
        return copy;
    }
  
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
}


/**
 * Handles all the Collision stuff
 */
const Collision = {
  areLinesIntersecting: (a, b, c, d) => {
    let denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
    let numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
    let numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));

    // Detect coincident lines (has a problem, read below)
    if (denominator == 0) return numerator1 == 0 && numerator2 == 0;
    
    let r = numerator1 / denominator;
    let s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
  },

  areCircleLineIntersectingPredictive(line, circle, circleFuture) {

    if(this.areCircleLineIntersecting(line.x1, line.x2, line.y1, line.y2, circle.x, circle.y, circle.radius)) return true;

    let linePointA = {x: line.x1, y: line.y1};
    let linePointB = {x: line.x2, y: line.y2};

    let circlePointA = {x: circle.x, y: circle.y};
    let circlePointB = {x: circleFuture.x, y: circleFuture.y};

    //console.log(line, circle, circleFuture);

    if(this.areLinesIntersecting(linePointA, linePointB, circlePointA, circlePointB)) return true;

    return false;
  },

  areCircleLineIntersecting(x1, x2, y1, y2, px, py, radius) {

    let A = px - x1;
    let B = py - y1;
    let C = x2 - x1;
    let D = y2 - y1;
  
    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = dot / len_sq;
  
    let xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    }
    else if (param > 1) {
      xx = x2;
      yy = y2;
    }
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    let dx = px - xx;
    let dy = py - yy;
    let distance = Math.sqrt(dx * dx + dy * dy);
  
    return distance <= radius;
  },

  areCircleRectIntersectingPredictive: (rectVertices, rectVerticesFuture, circle, circleFuture) => {

    // check if circle already in rect
    if(Collision.areCircleRectIntersecting(rectVertices[0], 
      rectVertices[1], 
      rectVertices[2], 
      rectVertices[3], 
      circle.x, 
      circle.y, 
      circle.radius)) return true;

    // get circle's and rect's future position

    //console.log(rectVerticesFuture);

    // check if circle went through rect
    for (let i = 0; i < rectVerticesFuture.length; i++) {
      let linePoint2 = (i == rectVerticesFuture.length - 1) ? rectVerticesFuture[0] : rectVerticesFuture[i+1];
      if(Collision.areLinesIntersecting(rectVerticesFuture[i], linePoint2, {x: circle.x, y: circle.y}, {x: circleFuture.x, y: circleFuture.y})) return true;
      //console.log(rectVerticesFuture[i], linePoint2, {x: circle.x, y: circle.y}, circlePosFuture);
    }

    return false;
  },

  areCircleRectIntersecting: (a, b, c, d, x, y, r) => {

    //console.log(Collision.areCircleLineIntersecting(c.x, c.y, d.x, d.y, x, y, r));

    return (Collision.arePointRectIntersecting(a, b, c, d, {x: x, y: y}) ||
            Collision.areCircleLineIntersecting(a.x, b.x, a.y, b.y, x, y, r) ||
            Collision.areCircleLineIntersecting(b.x, c.x, b.y, c.y, x, y, r) ||
            Collision.areCircleLineIntersecting(c.x, d.x, c.y, d.y, x, y, r) ||
            Collision.areCircleLineIntersecting(d.x, a.x, d.y, a.y, x, y, r));
  },
  
  arePointRectIntersecting: (a, b, c, d, p) => {

    let AB = Vec2.subtract(a, b);
    let AM = Vec2.subtract(a, p);
    let BC = Vec2.subtract(b, c);
    let BM = Vec2.subtract(b, p);
    let dotABAM = Vec2.dotProduct(AB, AM);
    let dotABAB = Vec2.dotProduct(AB, AB);
    let dotBCBM = Vec2.dotProduct(BC, BM);
    let dotBCBC = Vec2.dotProduct(BC, BC);

    return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
  },

  areLinesIntersecting: (a, b, c, d) => {
      
    let denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
    let numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
    let numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));

    // Detect coincident lines (has a problem, read below)
    if (denominator == 0) return numerator1 == 0 && numerator2 == 0;
    
    let r = numerator1 / denominator;
    let s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
  }
}

