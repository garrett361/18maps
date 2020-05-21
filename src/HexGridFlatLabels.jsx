// Labeled axes for hexGridFlat
import React from 'react';

// Polygon utilites
import * as polygonUtils from './PolygonUtils'
// Polygon creator
import Polygon from './Polygon'




// required HexGridFlatLabels props:
// nx: number hexagons along x direction
// ny: number hexagons along y direction
// origin: 2-component vector marking origin of the grid
// edgeLength: length of hex edge 
// vertexlength: length from polygon center to vertices; used if no edgeLength provided


let HexGridFlatLabels = (props) => {

    let {nx,ny,origin,edgeLength,vertexlength} = props;

    let hexhalfangle=1/3*Math.PI;
    if (edgeLength) {
        var dy=edgeLength*Math.tan(hexhalfangle)/2;
        var dx=edgeLength+edgeLength/Math.cos(hexhalfangle);
    } else {
        var dy=vertexlength*Math.sin(hexhalfangle);
        var dx=2*vertexlength+2*Math.cos(hexhalfangle)*vertexlength;
    };

    // array of letters
    let alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Create array of x-label positions for top of grid

    let xpointstop=[polygonUtils.vectoradd(origin,[0,-dy*1.5])];

    for (let i=0; i<2*nx-1; i++) {
        xpointstop.push(polygonUtils.vectoradd(xpointstop[xpointstop.length-1],[dx/2,0]));
    };

    // Translate to create positions for bottom of grid

    let xpointsbottom=xpointstop.map(item =>{
        return polygonUtils.vectoradd(item,[0,(ny+2.5)*dy]);
    });

    // Create labels from the points

    let xlabelstop = xpointstop.map((item,i)=>{

        return (
            <text textAnchor="middle" fontSize={edgeLength ? edgeLength/2 : vertexlength/2} key={item} x={item[0]} y={item[1]} {...props}>
                {alphabet[i]}
            </text>
        );
    });

    let xlabelsbottom = xpointsbottom.map((item,i)=>{

        return (
            <text textAnchor="middle" fontSize={edgeLength ? edgeLength/2 : vertexlength/2} key={item} x={item[0]} y={item[1]} {...props}>
                {alphabet[i]}
            </text>
        );
    });

    let xlabels=xlabelstop.concat(xlabelsbottom);

    // Create array of y-label positions for left of grid

    let ypointsleft=[polygonUtils.vectoradd(origin,[-dx*.5,0])];

    for (let i=0; i<ny-1; i++) {
        ypointsleft.push(polygonUtils.vectoradd(ypointsleft[ypointsleft.length-1],[0,dy]));
    };

    // Translate to create positions for right of grid

    let ypointsright=ypointsleft.map(item =>{
        return polygonUtils.vectoradd(item,[(nx+.5)*dx,0]);
    });

    // Create labels from the points

    let ylabelsleft = ypointsleft.map((item,i)=>{

        return (
            <text textAnchor="middle" fontSize={edgeLength ? edgeLength/2 : vertexlength/2} key={item} x={item[0]} y={item[1]} {...props}>
                {i+1}
            </text>
        );
    });

    let ylabelsright = ypointsright.map((item,i)=>{

        return (
            <text textAnchor="middle" fontSize={edgeLength ? edgeLength/2 : vertexlength/2} key={item} x={item[0]} y={item[1]} {...props}>
                {i+1}
            </text>
        );
    });

    let ylabels=ylabelsleft.concat(ylabelsright);
    
    return xlabels.concat(ylabels);

}; //HexGridFlatLabels

export default HexGridFlatLabels;