// Creating SVG Polygons.  

// React
import React from 'react';

// Polygon utilites
import * as polygonUtils from './PolygonUtils'



// Polygon props: 
// center: a two-component vector labeling the center of the polygon
// n: number of sides for the polygon (n-gon)
// sidelength: lenth of any one edge of the polygon
// vertexlength: length of vector from center to any one of the polygon's vertices; used if edgelenth not provided


let Polygon = (props) => {
 
    // Polygon vertices in coordinate pairs as 2-components arrays within arrays, e.g.
    // vertices=[[1,2],[3,4],..]
      let {center,n,vertexlength,edgeLength} = props
      let vertices=[];

      if (edgeLength) {
        let vertexlengthFromEdge=2*edgeLength*Math.cos(1/2*(1-2/n)*Math.PI);
        vertices=polygonUtils.polygonVerticesFlatBottom(center,n,vertexlengthFromEdge);
      } else {
        vertices=polygonUtils.polygonVerticesFlatBottom(center,n,vertexlength);
      }

    // Define default props here, if desired
      Polygon.defaultProps= {
          
      };

      

      return (
       
         <polygon 
         {...props} //This let us feed in whatever other props we want to the polygon, e.g. styling
         points={vertices.map(p => p.join(',')).join(' ')}
         />


      ); // return

}; //Polygon

export default Polygon;