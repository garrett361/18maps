// Outputs a plane-filling hex grid with flat tops using doubled coordinates
// as in https://www.redblobgames.com/grids/hexagons/
// Simply fills some set rectangle with hexes
import React from 'react';

// Polygon utilites
import * as polygonUtils from './PolygonUtils'
// Polygon creator
import Polygon from './Polygon'




// required HexGridFlat props:
// nx: number hexagons along x direction
// ny: number hexagons along y direction
// origin: 2-component vector marking origin of the grid
// edgelength: length of hex edge 
// vertexlength: length from polygon center to vertices; used if no edgelength provided


let HexGridFlat = (props) => {

    let {nx,ny,origin,edgelength,vertexlength} = props;

    let hexgridpoints=polygonUtils.hexGridFlat(nx,ny,origin,edgelength,vertexlength);

    let gridFill = hexgridpoints.map((item)=>{

        return (
            <Polygon key={item} center={item} n={6} edgelength={edgelength} vertexlength={vertexlength} {...props}/> //{...props} allows us to pass through, e.g., style props to the SVG
        );
    })

      return gridFill;

}; //HexGridFlat

export default HexGridFlat;