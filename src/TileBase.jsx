// Base Hex SVG

// React
import React, { Component } from 'react';


// HexBase utilites
import * as polygonUtils from './PolygonUtils'


class TileBase extends Component {


    render() {

        // All necessary props:
        let { children, edgeLength, borderColor, baseColor, center, rotation } = this.props;
        // hex Angle bisecting any vertex
        let hexAngle = Math.PI / 3;


        // Basic hex on which we will construct more complicated tiles
        // center: a two-component vector labeling the center of the polygon
        // edgeLength: length of any one edge of the hexagon (this is the same as the length from the hex center to any vertex)
        let HexBase = (props) => {
            // HexBase vertices in coordinate pairs as 2-components arrays within arrays, e.g.
            // vertices=[[1,2],[3,4],..]

            // include a border color and recompute the edgeLength to account for borderColor thickening
            let borderWidth = edgeLength / 25;
            let edgeBorderCorrected = edgeLength - borderWidth / 2 / Math.sin(hexAngle);

            let vertices = polygonUtils.polygonVerticesFlatBottom(center, 6, edgeBorderCorrected);

            let rotationAngle = 0;
            if (rotation) {
                rotationAngle = rotation * 60;
            }
            
            return (
                <g
                    transform={"rotate(" + rotationAngle + " " + center[0] + " " + center[1] + ")"}
                >
                    <polygon
                        {...props} //This let us feed in whatever other props we want to the polygon, e.gbaseColor. styling
                        style={{ stroke: borderColor, strokeWidth: borderWidth, fill: baseColor }}
                        points={vertices.map(p => p.join(',')).join(' ')}
                    />
                    {/* Put children inside nested SVG so that they are placed relative to tile's origin */}
                    <svg
                        version="1.1"
                        x={center[0]}
                        y={center[1]}
                        overflow='visible'>
                        {children}
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