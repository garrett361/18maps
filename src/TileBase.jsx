// Base Hex SVG.  Currently contains track/city/etc svg defs, but should refactor

// React
import React, { Component } from 'react';

// Ramda
import * as R from 'ramda';


// HexBase utilites
import * as polygonUtils from './PolygonUtils'

// import set of all tiles
import tileSet from './data/tiles/tileSet'


class TileBase extends Component {


    render() {

        // All necessary props:
        let { children, edgeLength, center, rotation, handleTileClick, name, borderColor } = this.props;

        // Track dimensions
        // hex Angle bisecting any vertex
        let hexHalfAngle = 1 / 3 * Math.PI;
        // include a border color and recompute the edgeLength to account for borderColor thickening
        let borderWidth = edgeLength / 40;
        let edgeBorderCorrected = edgeLength - 1 / 2 * borderWidth / Math.sin(hexHalfAngle);


        // dimensions for track and other elements
        let hexInnerFlatToFlat = edgeBorderCorrected * Math.tan(hexHalfAngle) - borderWidth;
        let hexInnerEdgeLength = hexInnerFlatToFlat / Math.tan(hexHalfAngle);
        let trackWidth = edgeLength / 7;
        let trackWidthInner = edgeLength / 10;
        let cityRadius = edgeLength / 4;
        let cityStroke = edgeLength / 30;
        let cityRadiusTotal = cityRadius + cityStroke / 2;

        // triple city geometry
        let triplecityShift = [0, -2 * cityRadiusTotal * Math.cos(hexHalfAngle / 2) + cityRadiusTotal * Math.tan(hexHalfAngle / 2)];
        let triplecityTop = polygonUtils.vectoradd([0, 0], triplecityShift);
        let triplecityBottomLeft = polygonUtils.vectoradd([-cityRadiusTotal, 2 * (cityRadiusTotal) * Math.cos(hexHalfAngle / 2)], triplecityShift);
        let triplecityBottomRight = polygonUtils.vectoradd([cityRadiusTotal, 2 * (cityRadiusTotal) * Math.cos(hexHalfAngle / 2)], triplecityShift)

        // Track types
        let HalfStraight = (props) => {
            let { rotation, color } = props;
            return (
                <g transform={'rotate(' + (rotation || 0) * 60 + ')'}>
                    <line x1={0} y1={0} x2={0} y2={hexInnerFlatToFlat / 2} stroke='white' strokeWidth={trackWidth} strokeLinecap='butt' />
                    <line x1={0} y1={0} x2={0} y2={hexInnerFlatToFlat / 2} stroke={color || 'black'} strokeWidth={trackWidthInner} strokeLinecap='butt' />
                </g>
            )
        };

        let Straight = (props) => {
            let { rotation, color } = props;
            return (
                <g transform={'rotate(' + (rotation || 0) * 60 + ')'}>
                    <line x1={0} y1={-hexInnerFlatToFlat / 2} x2={0} y2={hexInnerFlatToFlat / 2} stroke='white' strokeWidth={trackWidth} strokeLinecap='butt' />
                    <line x1={0} y1={-hexInnerFlatToFlat / 2} x2={0} y2={hexInnerFlatToFlat / 2} stroke={color || 'black'} strokeWidth={trackWidthInner} strokeLinecap='butt' />
                </g>
            )
        };

        let Sharp = (props) => {
            let { rotation, color } = props;
            return (
                <g transform={'rotate(' + (rotation || 0) * 60 + ')'}>
                    <path
                        d={"M 0 " + hexInnerFlatToFlat / 2 + " " +
                            "A " + hexInnerEdgeLength / 2 + " " + hexInnerEdgeLength / 2 + " 0 0 1 " + 3 / 4 * hexInnerEdgeLength + " " + Math.sqrt(3) / 4 * hexInnerEdgeLength}
                        fill="transparent"
                        stroke="white"
                        strokeWidth={trackWidth}
                        strokeLinecap='butt'
                    />
                    <path
                        d={"M 0 " + hexInnerFlatToFlat / 2 + " " +
                            "A " + hexInnerEdgeLength / 2 + " " + hexInnerEdgeLength / 2 + " 0 0 1 " + 3 / 4 * hexInnerEdgeLength + " " + Math.sqrt(3) / 4 * hexInnerEdgeLength}
                        fill="transparent"
                        stroke={color || 'black'}
                        strokeWidth={trackWidthInner}
                        strokeLinecap='butt'
                    />
                </g>
            )
        };


        let Gentle = (props) => {
            let { rotation, color } = props;
            return (
                <g transform={'rotate(' + (rotation || 0) * 60 + ')'}>
                    <path
                        id="gentle"
                        d={"M 0 " + hexInnerFlatToFlat / 2 + " " +
                            "A " + 3 / 2 * hexInnerEdgeLength + " " + 3 / 2 * hexInnerEdgeLength + " 0 0 1 " + 3 / 4 * hexInnerEdgeLength + " " + -Math.sqrt(3) / 4 * hexInnerEdgeLength}
                        fill="transparent"
                        stroke="white"
                        strokeWidth={trackWidth}
                        strokeLinecap='butt'
                    />
                    <path
                        id="gentle"
                        d={"M 0 " + hexInnerFlatToFlat / 2 + " " +
                            "A " + 3 / 2 * hexInnerEdgeLength + " " + 3 / 2 * hexInnerEdgeLength + " 0 0 1 " + 3 / 4 * hexInnerEdgeLength + " " + -Math.sqrt(3) / 4 * hexInnerEdgeLength}
                        fill="transparent"
                        stroke={color || 'black'}
                        strokeWidth={trackWidthInner}
                        strokeLinecap='butt'
                    />
                </g>
            )
        };


        // Cities

        let SingleCity = (props) => {
            let { color } = props;
            return (
                <circle cx="0" cy="0" r={cityRadius} strokeWidth={trackWidth / 3} stroke='black' fill={color || 'white'} />
            );
        };

        let DoubleCity = (props) => {
            let { color } = props;
            return (
                <g >
                    <line x1={0} y1={edgeLength / 4} x2={0} y2={-edgeLength / 4} strokeWidth={2 * cityRadius + cityStroke} stroke='black' />
                    <line x1={0} y1={edgeLength / 4} x2={0} y2={-edgeLength / 4} strokeWidth={2 * cityRadius - cityStroke} stroke='lightgray' />
                    <circle cx="0" cy={cityRadiusTotal} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                    <circle cx="0" cy={-cityRadius - cityStroke / 2} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                </g>
            );
        };


        let TripleCity = (props) => {
            let { color } = props;
            return (
                <g id="triplecity" >
                    <line x1={triplecityTop[0]} y1={triplecityTop[1]} x2={triplecityBottomRight[0]} y2={triplecityBottomRight[1]} stroke='black' strokeWidth={2 * cityRadiusTotal} />
                    <line x1={triplecityBottomRight[0]} y1={triplecityBottomRight[1]} x2={triplecityBottomLeft[0]} y2={triplecityBottomLeft[1]} stroke='black' strokeWidth={2 * cityRadiusTotal} />
                    <line x1={triplecityBottomLeft[0]} y1={triplecityBottomLeft[1]} x2={triplecityTop[0]} y2={triplecityTop[1]} stroke='black' strokeWidth={2 * cityRadiusTotal} />
                    <line x1={triplecityTop[0]} y1={triplecityTop[1]} x2={triplecityBottomRight[0]} y2={triplecityBottomRight[1]} stroke='lightgray' strokeWidth={2 * cityRadius - cityStroke} />
                    <line x1={triplecityBottomRight[0]} y1={triplecityBottomRight[1]} x2={triplecityBottomLeft[0]} y2={triplecityBottomLeft[1]} stroke='lightgray' strokeWidth={2 * cityRadius - cityStroke} />
                    <line x1={triplecityBottomLeft[0]} y1={triplecityBottomLeft[1]} x2={triplecityTop[0]} y2={triplecityTop[1]} stroke='lightgray' strokeWidth={2 * cityRadius - cityStroke} />
                    <circle cx={triplecityTop[0]} cy={triplecityTop[1]} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                    <circle cx={triplecityBottomLeft[0]} cy={triplecityBottomLeft[1]} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                    <circle cx={triplecityBottomRight[0]} cy={triplecityBottomRight[1]} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                </g>
            );
        };

        let QuadrupleCity = (props) => {
            let { color } = props;
            return (
                <g id="quadruplecity">
                    <line x1={0} y1={edgeLength / 4} x2={0} y2={-edgeLength / 4} strokeWidth={4 * cityRadius + 2 * cityStroke} stroke='black' />
                    <line x1={0} y1={edgeLength / 4} x2={0} y2={-edgeLength / 4} strokeWidth={4 * cityRadius} stroke='lightgray' />
                    <line y1={0} x1={edgeLength / 4} y2={0} x2={-edgeLength / 4} strokeWidth={4 * cityRadius + 2 * cityStroke} stroke='black' />
                    <line y1={0} x1={edgeLength / 4} y2={0} x2={-edgeLength / 4} strokeWidth={4 * cityRadius} stroke='lightgray' />
                    <circle cx={-cityRadius - cityStroke / 2} cy={cityRadiusTotal} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                    <circle cx={cityRadiusTotal} cy={cityRadiusTotal} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                    <circle cx={-cityRadius - cityStroke / 2} cy={-cityRadius - cityStroke / 2} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                    <circle cx={cityRadiusTotal} cy={-cityRadius - cityStroke / 2} r={cityRadius} strokeWidth={cityStroke} stroke='black' fill={color || 'white'} />
                </g>
            );
        };


        // Basic hex on which we will construct more complicated tiles
        // center: a two-component vector labeling the center of the polygon
        // edgeLength: length of any one edge of the hexagon (this is the same as the length from the hex center to any vertex)
        let HexBase = (props) => {
            // HexBase vertices in coordinate pairs as 2-components arrays within arrays, e.g.
            // vertices=[[1,2],[3,4],..]

            let vertices = polygonUtils.polygonVerticesFlatBottom(center, 6, edgeBorderCorrected);

            let rotationAngle = 0;
            if (rotation) {
                rotationAngle = rotation * 60;
            }

            // Filling the tile w/ components based on the tile name, if available
            // Based on the tile name, pull the tile data 
            let tileData = null;
            let tileTrack = [];
            let tileRevenue = [];
            let tileLabels = [];
            let tileDisplayName = null;
            if (name) {
                tileData = R.find(R.propEq('name', name), tileSet);
                if (tileData.track) {
                    tileTrack = tileData.track.map((i, j) => {
                        let tileProps = null;
                        if (i.props) {
                            tileProps = i.props;
                        }
                        // Below code is necessary to dynamically render react elements via strings:
                        return (
                            React.createElement(eval(i.name), R.merge(tileProps, { key: j }))
                        )
                    });
                };
                if (tileData.revenue) {
                    tileRevenue = tileData.revenue.map((i, j) => {
                        let tileProps = null;
                        if (i.props) {
                            tileProps = i.props;
                        }
                        // Below code is necessary to dynamically render react elements via strings:
                        return (
                            React.createElement(eval(i.name), R.merge(tileProps, { key: j }))
                        )
                    });
                };
                if (tileData.displayName) {
                    tileDisplayName = tileData.displayName;
                };

            };

            return (
                <g
                    transform={"rotate(" + rotationAngle + " " + center[0] + " " + center[1] + ")"}
                    onClick={handleTileClick}
                >
                    <polygon
                        {...props} //This let us feed in whatever other props we want to the polygon, e.gbaseColor. styling
                        style={{ stroke: borderColor || tileData.borderColor, strokeWidth: borderWidth, fill: tileData.baseColor || 'transparent', opacity: tileData.opacity || 1 }}
                        points={vertices.map(p => p.join(',')).join(' ')}
                    />
                    {/* Put children inside nested SVG so that they are placed relative to tile's origin */}
                    <svg
                        version="1.1"
                        x={center[0]}
                        y={center[1]}
                        overflow='visible'>
                        {children}
                        {/* Track, revenue objects, and labels */}
                        {tileTrack && tileTrack}
                        {tileRevenue && tileRevenue}
                        {tileLabels && tileLabels}
                        {/* tile number */}
                        {tileDisplayName && <text x={edgeLength / 3} y={edgeLength * 2 / 3} textAnchor="middle" dominantBaseline="middle" fontSize={edgeLength / 5}>{tileDisplayName}</text>}
                    </svg>
                </g>
            );

        }; //HexBase


        return (
            <HexBase />
        );
    }

}; //TileBase


export default TileBase;