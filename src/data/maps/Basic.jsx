// Polygon utilites
import * as polygonUtils from '../../PolygonUtils'


// mapDims sets the size and basic hex dimensions: nx, ny, origin, and edgeLength in order
export let mapDims={
    nx:10,
    ny:20,
    origin: [40,50],
    edgeLength:10,
};

// defining the initial hex grid
let {nx,ny,origin,edgeLength} = mapDims;
export let initialhexes=polygonUtils.hexGridFlat(nx,ny,origin,edgeLength).map(item =>{
    return(
      {center: item,
       fill: 'green',
       edgeLength: 10,
       stroke: 'black',
       strokeWidth: .5,
       id: 'blank'
     });
   });