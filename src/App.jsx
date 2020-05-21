// firebase code from https://css-tricks.com/intro-firebase-react/
// https://medium.com/get-it-working/get-googles-firestore-working-with-react-c78f198d2364

import React, { Component } from 'react';
// Router
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

// SVG wrapper
import SVG from './SVG'
import TileBase from './TileBase'
import HexBase from './HexBase';
import Polygon from './Polygon';


// Grids
import SquareGrid from './SquareGrid'
import HexGridFlat from './HexGridFlat';
import HexGridFlatLabels from './HexGridFlatLabels';


// HexBase utilites
import * as polygonUtils from './PolygonUtils'

// Set grid parameters

let [nx,ny,origin,edgeLength]=[10,10,[100,100],40];


class App extends Component {



  render() {

    let hexPoints=polygonUtils.hexGridFlat(nx,ny,origin,edgeLength);
    console.log(hexPoints)

    let hexFill=hexPoints.map(item=>{
      return <TileBase center={item} edgeLength={40} borderColor='green' baseColor='yellow'/>
    });



    return (



      <div className="container">

        <h1>Polygons</h1>



        <SVG height={2*ny*edgeLength} width={nx*edgeLength*4} style={{ backgroundColor: 'azure'}}>

        <HexGridFlatLabels nx={nx} ny={ny} edgeLength={edgeLength} origin={origin} />


          {hexFill}


        </SVG>



      </div >

    );

  }; // render


}; //App





export default App;
