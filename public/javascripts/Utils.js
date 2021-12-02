const Cookies = {
  get: (cname) => {
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
  
  
  set: (cname, cvalue, exyears) => {
    let d = new Date();
    d.setTime(d.getTime() + (exyears*24*60*60*1000*365));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
}



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
  }
}




function getPlayerRectVertices(players, canvasSize){
  
  let vertices = [];
  let polygonVertices = getPolygonVertices(players.length, 0.5, canvasSize);
  let polygonSideLength = getPolygonSideLength(0.5, players.length, -1);
  let playerHeightFactor = 30;


  for(let i = 0; i < players.length; i++){

    // Get vector of the players polygon side
    let oVectorSide, dirVectorSide;

    if(i == players.length - 1){
      oVectorSide = polygonVertices[0];
      dirVectorSide = Vec2.subtract(polygonVertices[i], polygonVertices[0]);
    }
    else{
      oVectorSide = polygonVertices[i];
      dirVectorSide = Vec2.subtract(polygonVertices[i+1], polygonVertices[i]);
    }

    // get the ortogonal vector of the side
    let ortogonalDirVectorSide = {x: -dirVectorSide.y, y: dirVectorSide.x};
    
    //calculate all corners of player
    let playerStartVertex = Vec2.applyDirVec(oVectorSide, players[i].position, dirVectorSide);
    let playerStartVertexLeft = Vec2.applyDirVec(playerStartVertex, polygonSideLength/playerHeightFactor, ortogonalDirVectorSide);
    let playerStartVertexRight = Vec2.applyDirVec(playerStartVertex, -(polygonSideLength/playerHeightFactor), ortogonalDirVectorSide);
    let playerEndVertexLeft = Vec2.applyDirVec(playerStartVertexLeft, players[i].size, dirVectorSide);
    let playerEndVertexRight = Vec2.applyDirVec(playerStartVertexRight, players[i].size, dirVectorSide);

    vertices.push(playerStartVertexLeft, playerStartVertexRight, playerEndVertexRight, playerEndVertexLeft);
  }  
  
  return vertices;
}


function getPolygonVertices(n, r, canvasSize){
  let vertices = [];

  for(let i = 0; i < n; i++){
    vertices.push({
      x: (r * Math.cos(2 * Math.PI * i / n) * canvasSize) + canvasSize/2, 
      y: (r * Math.sin(2 * Math.PI * i / n) * canvasSize) + canvasSize/2
    });
  }

  return vertices;
}


function getPolygonSideLength(r, n, canvasSize = -1){

  let p1, p2;

  if(canvasSize == -1){
    p1 = {
      x: (r * Math.cos(2 * Math.PI * 0 / n)), 
      y: (r * Math.sin(2 * Math.PI * 0 / n))
    };
  
    p2 = {
      x: (r * Math.cos(2 * Math.PI * 1 / n)),
      y: (r * Math.sin(2 * Math.PI * 1 / n))
    };
  }
  else{
    p1 = {
      x: (r * Math.cos(2 * Math.PI * 0 / n) * canvasSize) + canvasSize/2, 
      y: (r * Math.sin(2 * Math.PI * 0 / n) * canvasSize) + canvasSize/2
    };
  
    p2 = {
      x: (r * Math.cos(2 * Math.PI * 1 / n) * canvasSize) + canvasSize/2, 
      y: (r * Math.sin(2 * Math.PI * 1 / n) * canvasSize) + canvasSize/2
    };
  }
  

  return this.getDistanceBetweenPoints(p1, p2);
}


function getPolygonSideDistance(radius, numSides, canvasSize){
  //return (radius * Math.acos(Math.PI/numSides)); 
  //console.log(this.getPolygonSideLength(numSides, radius));
  return Math.sqrt(Math.pow(radius * canvasSize, 2) - Math.pow(this.getPolygonSideLength(radius, numSides) / 2, 2))
}


function getDistanceBetweenPoints(p1, p2){
  var a = p1.x - p2.x;
  var b = p1.y - p2.y;

  return Math.sqrt( a*a + b*b );
}


function getTwoHighestVertices(vertices) {
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
