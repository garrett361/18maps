//SVG Container for hex map. Implements:
// -axis labels
// -tile placement

// Goal: only input prop should be an array filled w/ tiles (and maybe a background color or stlye elements)
// Based on tile locations, should be able to automatically size map and place labels
// Tile input should have a position property which is a two-component array of the form
// item.position=['AA',4], which will be translated into a map position

// React
import React from 'react';

// Ramda
import * as R from 'ramda';

// Polygon utilites
import * as polygonUtils from './PolygonUtils'

// Basic hex tiles
import TileBase from './TileBase'



// The Map itself:
let Map = (props) => {

    // accepts an array containing tiles
    let { tiles, edgeLength, origin, children, handleTileClick, tilePositionToCenter, alphabet, nx, ny } = props;

    // hex Angle bisecting any vertex
    let hexHalfAngle = 1 / 3 * Math.PI;

    // From the tile prop, create the corresponding array of hexes
    let tileSVG = tiles.map((item, i) => {

        return (
            <TileBase
                key={item.position}
                center={tilePositionToCenter(item.position)}
                edgeLength={edgeLength}
                rotation={item.rotation}
                name={item.name}
                handleTileClick={() => { handleTileClick(i) }} >
            </TileBase>
        );
    });


    // SVG wrapper
    let SVG = (props) => {

        let namespaces = {
            "xmlns": "http://www.w3.org/2000/svg",
            "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
        };

        let { width, height, viewBox, preserveAspectRatio, style, defs, children } = props

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
                {children}
            </svg>

        ); // return

    }; //SVG


    // Axis labels
    let HexGridFlatLabels = (props) => {

        let { nx, ny, origin, testtest } = props;

        let dy = testtest * Math.tan(hexHalfAngle) / 2;
        let dx = testtest + testtest / Math.cos(hexHalfAngle);

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
                <text textAnchor="middle" fontSize={testtest / 2} key={item} x={item[0]} y={item[1]} {...props}>
                    {alphabet[i]}
                </text>
            );
        });

        let xlabelsbottom = xpointsbottom.map((item, i) => {
            return (
                <text textAnchor="middle" fontSize={testtest / 2} key={item} x={item[0]} y={item[1]} {...props}>
                    {alphabet[i]}
                </text>
            );
        });

        let xlabels = xlabelstop.concat(xlabelsbottom);

        // Create array of y-label positions for left of grid
        let ypointsleft = [polygonUtils.vectoradd(origin, [-dx * .5, dy / 5])];
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
                <text textAnchor="middle" fontSize={testtest / 2} key={item} x={item[0]} y={item[1]} {...props}>
                    {i + 1}
                </text>
            );
        });

        let ylabelsright = ypointsright.map((item, i) => {
            return (
                <text textAnchor="middle" fontSize={testtest / 2} key={item} x={item[0]} y={item[1]} {...props}>
                    {i + 1}
                </text>
            );
        });

        let ylabels = ylabelsleft.concat(ylabelsright);

        return xlabels.concat(ylabels);

    }; //HexGridFlatLabels


    return (
        <SVG
            {...props}
            height={2.25 * ny * edgeLength}
            width={nx * edgeLength * 4.25}
        >

            <HexGridFlatLabels
                origin={origin}
                testtest={edgeLength}
                nx={nx}
                ny={ny}
            />

            {tileSVG}

            {children}

        </SVG>
    )
}



export default Map;