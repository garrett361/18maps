// Base Hex 

// React
import React from 'react';

// HexBase utilites
import * as polygonUtils from './PolygonUtils'



// HexBase props: 
// center: a two-component vector labeling the center of the polygon
// edgeLength: length of any one edge of the hexagon (this is the same as the length from the hex center to any vertex)

// hex Angle bisecting any vertex
let hexAngle=Math.PI/3;

let HexBase = (props) => {
 
    // HexBase vertices in coordinate pairs as 2-components arrays within arrays, e.g.
    // vertices=[[1,2],[3,4],..]
      let {center,edgeLength,border,baseColor} = props
      let n=6;
    // include a border and recompute the edgeLength to account for border thickening
      let borderWidth=edgeLength/25; 
      let edgeBorderCorrected=edgeLength-borderWidth/2/Math.sin(hexAngle);

      let vertices=polygonUtils.polygonVerticesFlatBottom(center,n,edgeBorderCorrected);

    // Define default props here, if desired
      HexBase.defaultProps= {
          
      };

      return (
       
         <polygon 
         {...props} //This let us feed in whatever other props we want to the polygon, e.g. styling
         style={{stroke: border, strokeWidth: borderWidth, fill: baseColor}}
         points={vertices.map(p => p.join(',')).join(' ')}
         />


      ); // return

}; //HexBase

export default HexBase;