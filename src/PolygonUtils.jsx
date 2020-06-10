// Collection of utilites for generating polygons

// Generate vertices of n-gon given center and side-length

// vector addition
export let vectoradd = (a, b) => {
    return a.map((e, i) => e + b[i]);
};

// dot product
export let dotproduct = (a, b) => {
    return a.map((e, i) => e * b[i]).reduce((c, d) => c + d, 0);
};


// 2D matrix multiplication
export let matrixmult = (matrix, vec) => {
    let newvec = matrix.map(item => dotproduct(item, vec));
    return newvec;
};

// 2D rotation matrix
export let rotationMatrix2D = (angle) => {
    return [[Math.cos(angle), -1 * Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
};



// n-gon vertices for a polygon w/ a pointy top.  center is a two-component array
export let polygonVerticesPointyTop = (center, n, vertexlength) => {

    let upvector = [0, vertexlength];
    let vertices = [upvector];
    let angle = 2 * Math.PI / n;
    let rot = rotationMatrix2D(angle);
    for (var i = 1; i < n; i++) {
        vertices.push(matrixmult(rot, vertices[vertices.length - 1]));
    };

    let shiftedvertices = vertices.map(i => vectoradd(i, center));

    return shiftedvertices;
};

// n-gon vertices for a polygon w/ a flat top
export let polygonVerticesFlatTop = (center, n, vertexlength) => {

    let upvector = [0, vertexlength];
    let flatangle = 1 / n * Math.PI;
    let upvectorRotated = matrixmult(rotationMatrix2D(flatangle), upvector);
    let vertices = [upvectorRotated];
    let angle = 2 * Math.PI / n;
    let rot = rotationMatrix2D(angle);
    for (var i = 1; i < n; i++) {
        vertices.push(matrixmult(rot, vertices[vertices.length - 1]));
    };

    let shiftedvertices = vertices.map(i => vectoradd(i, center));

    return shiftedvertices;
};


// n-gon vertices for a polygon w/ a flat bottom
export let polygonVerticesFlatBottom = (center, n, vertexlength) => {

    let upvector = [0, -vertexlength];
    let flatangle = 1 / n * Math.PI;
    let upvectorRotated = matrixmult(rotationMatrix2D(flatangle), upvector);
    let vertices = [upvectorRotated];
    let angle = 2 * Math.PI / n;
    let rot = rotationMatrix2D(angle);
    for (var i = 1; i < n; i++) {
        vertices.push(matrixmult(rot, vertices[vertices.length - 1]));
    };

    let shiftedvertices = vertices.map(i => vectoradd(i, center));

    return shiftedvertices;
};


// array containing locations of points on rectangular grid
export let squareGrid = (nx, ny, dx, dy, origin) => {

    let gridpoints = [origin];
    let xvec = [dx, 0];
    let yvec = [0, dy];

    for (var j = 0; j < ny; j++) {
        for (var i = 0; i < nx - 1; i++) {
            gridpoints.push(vectoradd(gridpoints[gridpoints.length - 1], xvec));
        };
        if (j !== ny - 1) {
            gridpoints.push(vectoradd(gridpoints[gridpoints.length - nx], yvec));
        };
    };

    return gridpoints;

};


// Outputs an array with center locations for plane-filling flat-topped hexes
// Using double coordinates as in https://www.redblobgames.com/grids/hexagons/
// center: a two-component vector labeling the center of the polygon
// nx/ny: number of tiles in x and y directions
// sidelength: lenth of any one edge of the polygon
// vertexlength: length of vector from center to any one of the polygon's vertices; used if edgelenth not provided
export let hexGridFlat = (nx, ny, origin, edgeLength, vertexlength) => {


    let hexhalfangle = 1 / 3 * Math.PI;

    if (edgeLength) {
        var dy = edgeLength * Math.tan(hexhalfangle) / 2;
        var dx = edgeLength + edgeLength / Math.cos(hexhalfangle);
    } else {
        var dy = vertexlength * Math.sin(hexhalfangle);
        var dx = 2 * vertexlength + 2 * Math.cos(hexhalfangle) * vertexlength;
    }

    let squaregridpoints = squareGrid(nx, ny, dx, dy, origin);

    let xvecoffset = [dx / 2, 0];

    let hexgridpoints = squaregridpoints.map((e, i) => {
        if (i % (2 * nx) < nx) {
            return e;
        } else {
            return vectoradd(e, xvecoffset);
        };
    })

    return hexgridpoints;

};


