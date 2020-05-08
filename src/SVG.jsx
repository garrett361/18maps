// SVG wrapper with additional options
import React from 'react';


const SVG = (props) => {
 
    const namespaces = {
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
      };

      const {width, height, viewBox, preserveAspectRatio, style, defs, children} = props


    // Define default props here, if desired
      SVG.defaultProps= {
          
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

export default SVG;