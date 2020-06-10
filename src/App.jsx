// firebase code from https://css-tricks.com/intro-firebase-react/
// https://medium.com/get-it-working/get-googles-firestore-working-with-react-c78f198d2364

import React, { Component } from 'react';
// Router
// import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

// Basic tile element
import TileBase from './TileBase'
// import set of all tiles
import tileSet from './data/tiles/tileSet'

// Map
import Map from './Map';

// HexBase utilites
import * as polygonUtils from './PolygonUtils'

// Set grid parameters
let [nx, ny, origin, edgeLength] = [10, 10, [100, 100], 40];

// initial state
let initialState = {
  tiles: [
    { position: ['A', 1], name: '5', rotation: 0 },
    { position: ['A', 3], name: 'blank' },
    { position: ['B', 2], name: 'blank' },
    { position: ['B', 4], name: 'blank' },
    { position: ['C', 1], name: 'blank' },
    { position: ['C', 3], name: 'blank' },
    { position: ['D', 2], name: 'blank' },
    { position: ['D', 4], name: 'blank' },
    { position: ['E', 3], name: '57', rotation: 0 },
    { position: ['E', 1], name: 'blank', rotation: 0 },
    { position: ['F', 2], name: 'blank' },
    { position: ['F', 4], name: 'blank' },
    { position: ['G', 5], name: 'blank' },
  ]
};


class App extends Component {

  state = initialState;

  // handling tile clicks
  handleTileClick = (i) => {
    let currentTiles = this.state.tiles;
    currentTiles[i].rotation = (currentTiles[i].rotation + 1) % 6;
    this.setState({ tiles: currentTiles });



  }



  render() {

    let { tiles } = this.state;

    return (

      <div className="container">

        <h1>Polygons</h1>

        <Map
          style={{ backgroundColor: 'azure' }}
          edgeLength={edgeLength}
          origin={origin}
          tiles={tiles}
          handleTileClick={this.handleTileClick}
        >

        </Map>
      </div >

    );

  }; // render


}; //App





export default App;
