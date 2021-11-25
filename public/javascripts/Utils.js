  function getPolygonSideDistance(radius, numSides){
    //return (radius * Math.acos(Math.PI/numSides)); 
    //console.log(this.getPolygonSideLength(numSides, radius));
    return Math.sqrt(Math.pow(radius * this.size, 2) - Math.pow(getPolygonSideLength(radius, numSides) / 2, 2))
  }

  function getPolygonSideLength(r, n){

    let p1 = {
      x: (r * Math.cos(2 * Math.PI * 0 / n) * this.size) + this.size/2, 
      y: (r * Math.sin(2 * Math.PI * 0 / n) * this.size) + this.size/2
    };
  
    let p2 = {
      x: (r * Math.cos(2 * Math.PI * 1 / n) * this.size) + this.size/2, 
      y: (r * Math.sin(2 * Math.PI * 1 / n) * this.size) + this.size/2
    };

    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
  
    return Math.sqrt( a*a + b*b );
  }
/*
  vec2Angle: (v1, v2) => {
    //return Math.acos(()/());
  },

  skalarProd: 10, 

  vec2Abs: (v) => {
    Math.sqrt(Math.pow(v.x, 2), Math.pow(v.y, 2));
  }*/
