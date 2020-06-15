//SVG Container for hex map. Implements:
// -axis labels
// -tile placement
// -train indicators

// Goal: only input props should be handlers, map dimensions,  an array filled w/ tiles and one w/ trains.
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

// SVG wrapper
let SVG = (props) => {

    let namespaces = {
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
    };

    let { width, height, viewBox, preserveAspectRatio, style, children } = props

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

    let { nx, ny, origin, edgelength, alphabet } = props;
    let hexHalfAngle = 1 / 3 * Math.PI;

    // spacing between x and y labels, set by hex size
    let dy = edgelength * Math.tan(hexHalfAngle) / 2;
    let dx = edgelength + edgelength / Math.cos(hexHalfAngle);

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
            <text textAnchor="middle" fontSize={edgelength / 2} key={item} x={item[0]} y={item[1]} {...props}>
                {alphabet[i]}
            </text>
        );
    });

    let xlabelsbottom = xpointsbottom.map((item, i) => {
        return (
            <text textAnchor="middle" fontSize={edgelength / 2} key={item} x={item[0]} y={item[1]} {...props}>
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
            <text textAnchor="middle" fontSize={edgelength / 2} key={item} x={item[0]} y={item[1]} {...props}>
                {i + 1}
            </text>
        );
    });

    let ylabelsright = ypointsright.map((item, i) => {
        return (
            <text textAnchor="middle" fontSize={edgelength / 2} key={item} x={item[0]} y={item[1]} {...props}>
                {i + 1}
            </text>
        );
    });

    let ylabels = ylabelsleft.concat(ylabelsright);

    return xlabels.concat(ylabels);

}; //HexGridFlatLabels


// Train displays basic info about trains and handles clicks
// Train data includes the name, cost, rusted by, value it is running for, etc
// Train takes on the data for a single train and a position
let Train = (props) => {
    let { train, center, borderColor, trainwidth, trainHeight } = props;

    // Build a rectange whose center is at the center prop
    let rectangle = <rect
        x={center[0] - trainwidth / 2}
        y={center[1] - trainHeight / 2}
        rx={trainHeight / 5}
        ry={trainHeight / 5}
        width={trainwidth}
        height={trainHeight}
        fill='white'
        stroke={borderColor || 'black'}
        strokeWidth={trainHeight / 20}
    />;

    // Text fills for the train card
    // Train number
    let trainNumber = <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={trainwidth / 2}
        x={center[0]}
        y={center[1]}
        fill={train.color || 'black'}
        stroke='black'
        strokeWidth={trainwidth / 100}
    >

        {train.name}
    </text>;
    // Could also have rusting info/price, but not sure it's necessary.  Clutter concerns


    return (
        <g>
            {rectangle}
            {trainNumber}
        </g>

    ); // return

}; //TextBox

// Displays the list of trains.
let MapTrainDisplay = (props) => {
    let { trains, svgwidth, origin, highlightColors } = props;
    // center defines what we choose as the center point of the train display
    let center = [svgwidth / 2, origin[1] / 4];
    // train card dimension
    let trainwidth = svgwidth / 7;
    let trainHeight = trainwidth / 2;

    if (trains) {

        // Locations of train cards
        let trainspacing = trainwidth / 4;
        let trainpositions = (i) => polygonUtils.vectoradd(center, [((1 - trains.length) / 2 + i) * (trainwidth + trainspacing), 0]);

        let traincards = trains.map((item, i) => {
            return (
                <Train
                    key={'train-' + i}
                    center={trainpositions(i)}
                    svgwidth={svgwidth}
                    trainwidth={trainwidth}
                    trainHeight={trainHeight}
                    borderColor={highlightColors[i]}
                    train={item}
                />
            );
        });


        return (
            // <Train
            //     center={center}
            //     svgwidth={svgwidth}
            //     trainwidth={trainwidth}
            //     trainHeight={trainHeight}
            //     train={{ name: 'test' }} />
            <g>
                {traincards}
            </g>
        )
    } else { return (null) };
};


// The Map itself:
let Map = (props) => {

    // accepts an array containing tiles
    let { trains, tiles, edgelength, origin, children, handleTileClick, tilePositionToCenter, alphabet, highlightColors, nx, ny } = props;

    // hex Angle bisecting any vertex
    let hexHalfAngle = 1 / 3 * Math.PI;
    let hexFlatToFlat = edgelength * Math.tan(hexHalfAngle);

    // SVG width
    let svgHeight = (ny / 2 - 1) * hexFlatToFlat + 2 * origin[1];
    let svgWidth = origin[0] + (2 * nx + 5) * edgelength - edgelength * Math.cos(hexHalfAngle);

    // From the tile prop, create the corresponding array of hexes
    let tileSVG = tiles.map((item, i) => {

        return (
            <TileBase
                key={item.position}
                center={tilePositionToCenter(item.position)}
                edgelength={edgelength}
                rotation={item.rotation}
                name={item.name}
                tileProps={item.tileProps}
                handleTileClick={() => { handleTileClick(i) }} >
            </TileBase>
        );
    });



    return (
        <SVG
            {...props}
            width={svgWidth}
            height={svgHeight}
        >
            {trains
                &&
                <MapTrainDisplay
                    svgwidth={svgWidth}
                    origin={origin}
                    trains={trains}
                    highlightColors={highlightColors}
                />
            }

            <HexGridFlatLabels
                origin={origin}
                edgelength={edgelength}
                nx={nx}
                ny={ny}
                alphabet={alphabet}
            />

            {tileSVG}

            {children}

        </SVG>
    )
}



export default Map;