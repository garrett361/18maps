//SVG Container for hex map. Implements:
// -axis labels
// -tile placement

// Goal: only input prop should be an array filled w/ tiles (and maybe a background color or stlye elements)
// Based on tile locations, should be able to automatically size map and place labels
// Tile input should have a position property which is a two-component array of the form
// item.position=['AA',4], which will be translated into a map position

// React
import React, { Component } from 'react';

// Ramda
import * as R from 'ramda';

// Polygon utilites
import * as polygonUtils from './PolygonUtils'

// Basic hex tiles
import TileBase from './TileBase'
import tileSet from './data/tiles/tileSet'


// Create an alphabet for the map
let alphabet1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let alphabet2 = R.map(i => i + i, alphabet1)
let alphabet3 = R.map(i => i + i + i, alphabet1)
let alphabet4 = R.map(i => i + i + i + i, alphabet1)
let alphabet = alphabet1.concat(alphabet2).concat(alphabet3).concat(alphabet4);



// SVG grid labels:
// required props:
// nx: number hexagons along x direction
// ny: number hexagons along y direction
// origin: 2-component vector marking origin of the grid
// edgeLength: length of hex edge 
// vertexlength: length from polygon center to vertices; used if no edgeLength provided
let HexGridFlatLabels = (props) => {

    let { nx, ny, origin, edgeLength, vertexlength } = props;

    let hexHalfAngle = 1 / 3 * Math.PI;
    if (edgeLength) {
        var dy = edgeLength * Math.tan(hexHalfAngle) / 2;
        var dx = edgeLength + edgeLength / Math.cos(hexHalfAngle);
    } else {
        var dy = vertexlength * Math.sin(hexHalfAngle);
        var dx = 2 * vertexlength + 2 * Math.cos(hexHalfAngle) * vertexlength;
    };

    // Create array of x-label positions for top of grid
    let xpointstop = [polygonUtils.vectoradd(origin, [0, -dy * 1.5])];
    for (let i = 0; i < 2 * nx - 1; i++) {
        xpointstop.push(polygonUtils.vectoradd(xpointstop[xpointstop.length - 1], [dx / 2, 0]));
    };

    // Translate to create positions for bottom of grid
    let xpointsbottom = xpointstop.map(item => {
        return polygonUtils.vectoradd(item, [0, (ny + 2.5) * dy]);
    });

    // Create labels from the points
    let xlabelstop = xpointstop.map((item, i) => {
        return (
            <text textAnchor="middle" fontSize={edgeLength ? edgeLength / 2 : vertexlength / 2} key={item} x={item[0]} y={item[1]} {...props}>
                {alphabet[i]}
            </text>
        );
    });

    let xlabelsbottom = xpointsbottom.map((item, i) => {
        return (
            <text textAnchor="middle" fontSize={edgeLength ? edgeLength / 2 : vertexlength / 2} key={item} x={item[0]} y={item[1]} {...props}>
                {alphabet[i]}
            </text>
        );
    });

    let xlabels = xlabelstop.concat(xlabelsbottom);

    // Create array of y-label positions for left of grid
    let ypointsleft = [polygonUtils.vectoradd(origin, [-dx * .5, 0])];
    for (let i = 0; i < ny - 1; i++) {
        ypointsleft.push(polygonUtils.vectoradd(ypointsleft[ypointsleft.length - 1], [0, dy]));
    };

    // Translate to create positions for right of grid
    let ypointsright = ypointsleft.map(item => {
        return polygonUtils.vectoradd(item, [(nx + .5) * dx, 0]);
    });

    // Create labels from the points
    let ylabelsleft = ypointsleft.map((item, i) => {

        return (
            <text textAnchor="middle" fontSize={edgeLength ? edgeLength / 2 : vertexlength / 2} key={item} x={item[0]} y={item[1]} {...props}>
                {i + 1}
            </text>
        );
    });

    let ylabelsright = ypointsright.map((item, i) => {
        return (
            <text textAnchor="middle" fontSize={edgeLength ? edgeLength / 2 : vertexlength / 2} key={item} x={item[0]} y={item[1]} {...props}>
                {i + 1}
            </text>
        );
    });

    let ylabels = ylabelsleft.concat(ylabelsright);

    return xlabels.concat(ylabels);

}; //HexGridFlatLabels


// Simple SVG wrapper:
let SVG = (props) => {

    let namespaces = {
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
    };

    let { width, height, viewBox, preserveAspectRatio, style, defs, children } = props


    // Define default props here, if desired
    SVG.defaultProps = {

    }

    return (

        <svg
            version="1.1"
            preserveAspectRatio={preserveAspectRatio}
            width={width}
            height={height}
            viewBox={viewBox}
            style={style}
            {...namespaces}
        >
            <defs>
                {defs}
            </defs>
            {children}
        </svg>

    ); // return

}; //SVG



// The Map itself:
let Map = (props) => {

    // accepts an array containing tiles
    let { tiles, edgeLength, origin, children } = props;
    // Find the maximum x position of any tile
    let nx = 0;
    tiles.forEach((item) => {
        let nxcurrent = (R.findIndex(a => a === item.position[0], alphabet) + 1) / 2;
        if (nxcurrent > nx) {
            nx = nxcurrent;
        }
    });

    // Find the maximum y position of any tile
    let ny = 0;
    tiles.forEach((item) => {
        if (item.position[1] > ny) {
            ny = item.position[1];
        }
    });

    // Place a hex for each tile in the list
    // Positioning system
    let tilePositionToCenter = (position) => {

        // create grid grid hex grid points based on tile data gathered above
        // hexGridFlat creates nx*ny grid points built in ny rows
        // where the odd numbered rows are offset
        let gridpoints = polygonUtils.hexGridFlat(nx, ny, origin, edgeLength);

        // The corresponding gridpoint is then:
        return (
            gridpoints[(position[1] - 1) * nx + Math.floor((R.findIndex(a => a === position[0], alphabet)) / 2)]
        );
    }
    // 

    // From the tile prop, create the corresponding array of hexes
    let tileSVG = tiles.map((item) => {

        // Based on the tile name, pull the tile data 
        let tileData=R.find(R.propEq('name',item.name),tileSet);
        return (
            <TileBase key={item.position} center={tilePositionToCenter(item.position)} edgeLength={edgeLength} borderColor='green' baseColor={tileData.color} rotation={item.rotation} >
                 <line x1={0} y1={-edgeLength/2} x2={0} y2={edgeLength/2} stroke='black' strokeWidth={2}/>
            </TileBase>
        );
    });

    return (
        <SVG
            {...props}
            height={2.25 * ny * edgeLength}
            width={nx * edgeLength * 4.25}
        >

            {children}

            {tileSVG}

            <HexGridFlatLabels
                {...props}
                nx={nx}
                ny={ny}
            />

        </SVG>
    )
}



export default Map;