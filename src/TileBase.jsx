// Base Hex SVG

// React
import React, { Component } from 'react';


// HexBase utilites
import * as polygonUtils from './PolygonUtils'


class TileBase extends Component {


    render() {

        // All necessary props:
        let { defs, children, edgeLength, borderColor, baseColor } = this.props;
        // hex Angle bisecting any vertex
        let hexAngle = Math.PI / 3;
        // hex Angle bisecting any vertex
        let svgWidth = 2 * edgeLength;
        let svgHeight = svgWidth*Math.sin(hexAngle);


        // Basic hex on which we will construct more complicated tiles
        // center: a two-component vector labeling the center of the polygon
        // edgeLength: length of any one edge of the hexagon (this is the same as the length from the hex center to any vertex)
        let HexBase = (props) => {

            // SVG
            let namespaces = {
                "xmlns": "http://www.w3.org/2000/svg",
                "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
            };

            // HexBase vertices in coordinate pairs as 2-components arrays within arrays, e.g.
            // vertices=[[1,2],[3,4],..]
            
            // include a border color and recompute the edgeLength to account for borderColor thickening
            let borderColorWidth = edgeLength / 25;
            let edgeBorderCorrected = edgeLength - borderColorWidth / 2 / Math.sin(hexAngle);
            let center = [svgWidth / 2, svgHeight / 2];

            let vertices = polygonUtils.polygonVerticesFlatBottom(center, 6, edgeBorderCorrected);

            // Define default props here, if desired
            HexBase.defaultProps = {

            };

            return (
                <svg
                    version="1.1"
                    width={svgWidth}
                    height={svgHeight}
                    {...namespaces}
                    style={{ backgroundColor: 'black'}}
                >
                    <defs>
                        {defs}
                    </defs>
                    <polygon
                        {...props} //This let us feed in whatever other props we want to the polygon, e.gbaseColor. styling
                        style={{ stroke: borderColor, strokeWidth: borderColorWidth, fill: baseColor }}
                        points={vertices.map(p => p.join(',')).join(' ')}
                    />
                    {children}
                </svg>
            );

        }; //HexBase


        return (
            <HexBase edgeLength={edgeLength} borderColor={borderColor} baseColor={baseColor} />
        );
    }

}; //TileBase


export default TileBase;