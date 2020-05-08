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

// Import maps
import * as basicMap from './data/maps/Basic'


class App extends Component {



  render() {



    return (



      <div className="container">

        <h1>Polygons</h1>

        <TileBase edgeLength={100} borderColor='green' baseColor='yellow'>
        <circle cx="25" cy="25" r="25"/>
        </TileBase>




      </div >

    );

  }; // render


}; //App





export default App;
