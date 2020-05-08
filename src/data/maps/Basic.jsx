// Polygon utilites
import * as polygonUtils from '../../PolygonUtils'


// mapDims sets the size and basic hex dimensions: nx, ny, origin, and edgelength in order
export let mapDims={
    nx:10,
    ny:20,
    origin: [40,50],
    edgelength:10,
};

// defining the initial hex grid
let {nx,ny,origin,edgelength} = mapDims;
export let initialhexes=polygonUtils.hexGridFlat(nx,ny,origin,edgelength).map(item =>{
    return(
      {center: item,
       fill: 'green',
       edgelength: 10,
       stroke: 'black',
       strokeWidth: .5,
       id: 'blank'
     });
   });