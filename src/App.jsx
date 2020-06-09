// firebase code from https://css-tricks.com/intro-firebase-react/
// https://medium.com/get-it-working/get-googles-firestore-working-with-react-c78f198d2364

import React, { Component } from 'react';
// Router
// import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

// SVG wrapper
import TileBase from './TileBase'

// Map
import Map from './Map';

// HexBase utilites
import * as polygonUtils from './PolygonUtils'

// Set grid parameters
let [nx, ny, origin, edgeLength] = [10, 10, [100, 100], 40];

// initial state
let initialState = {
  tiles: [
    { position: ['A', 3], name: 'yellow', rotation: 0, components: ['myCircle'] },
    { position: ['A', 1], name: 'yellow', rotation: 1, components: ['myCircle','myLine'] },
    { position: ['D', 2], name: 'yellow', rotation: 2, components: ['myCircle'] },
    { position: ['F', 3], name: 'yellow', rotation: 3, components: ['myLine'] }]
};


class App extends Component {

  state = initialState;

  // handling tile clicks
  handleTileClick = (i) => {
    let currentTiles = this.state.tiles;
    currentTiles[i].name = 'green';
    currentTiles[i].rotation = (currentTiles[i].rotation + 1) % 6;
    this.setState({ tiles: currentTiles });
  }


  render() {

    let { tiles } = this.state;

    let hexPoints = polygonUtils.hexGridFlat(nx, ny, origin, edgeLength);

    // hexFill is just a set of filling hexes for testing
    let hexFill = hexPoints.map((item, i) => {
      return <TileBase key={i} center={item} edgeLength={40} borderColor='green' baseColor='yellow' />
    });




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
