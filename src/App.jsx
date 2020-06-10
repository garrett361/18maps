// firebase code from https://css-tricks.com/intro-firebase-react/
// https://medium.com/get-it-working/get-googles-firestore-working-with-react-c78f198d2364

// React
import React, { Component } from 'react';
// Ramda
import * as R from 'ramda';

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
let [origin, edgeLength] = [[100, 100], 40];
// highlight colors
let highlightColors = ['deeppink', 'aqua', 'lime', 'darkorchid', 'darkorange'];

// Create an alphabet for the map
let alphabet1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let alphabet2 = R.map(i => i + i, alphabet1)
let alphabet3 = R.map(i => i + i + i, alphabet1)
let alphabet4 = R.map(i => i + i + i + i, alphabet1)
let alphabet = alphabet1.concat(alphabet2).concat(alphabet3).concat(alphabet4);

// initial state
let initialState = {
  tiles: [
    { position: ['A', 1], name: '5' },
    { position: ['A', 3], name: 'blank' },
    { position: ['B', 2], name: 'blank' },
    { position: ['B', 4], name: 'blank' },
    { position: ['C', 1], name: 'blank' },
    { position: ['C', 3], name: 'blank' },
    { position: ['D', 2], name: 'blank' },
    { position: ['D', 4], name: 'blank' },
    { position: ['E', 3], name: '57' },
    { position: ['E', 1], name: 'blank' },
    { position: ['F', 2], name: 'blank' },
    { position: ['F', 4], name: 'blank' },
    { position: ['H', 12], name: 'blank' },
  ],
};

class App extends Component {

  state = initialState;
  // Positioning system. Maps coordinates in, e.g., [A,13] form to svg coordinates
  tilePositionToCenter = (position) => {

    let { tiles } = this.state;

    // Find the maximum x position of any tile
    let nx = 0;
    tiles.forEach((item) => {
      let nxcurrent = (R.findIndex(a => a === item.position[0], alphabet) + 1) / 2;
      if (nxcurrent > nx) {
        nx = Math.ceil(nxcurrent);
      }
    });

    // Find the maximum y position of any tile
    let ny = 0;
    tiles.forEach((item) => {
      if (item.position[1] > ny) {
        ny = item.position[1];
      }
    });

    // create grid grid hex grid points based on tile data gathered above
    // hexGridFlat creates nx*ny grid points built in ny rows
    // where the odd numbered rows are offset
    let gridpoints = polygonUtils.hexGridFlat(nx, ny, origin, edgeLength);


    // The corresponding gridpoint is then:
    return (
      gridpoints[(position[1] - 1) * nx + Math.floor((R.findIndex(a => a === position[0], alphabet)) / 2)]
    );
  };


  // handling replacing tiles on click
  handleTileReplace = (i) => {

    // 1) bring up menu of tile options
    // 2) bring up rotation menu

    // Grab current tile info
    let currentTiles = this.state.tiles;
    let position = currentTiles[i].position;
    let center = this.tilePositionToCenter(position);

    // Tiles to display, given the above
    let tileList = tileSet;

    // Button display data
    let numberofbuttons = tileList.length;
    let angle = 2 * Math.PI / numberofbuttons;
    let buttonSize = edgeLength / 2;
    let buttonDistance = 5 / 3 * edgeLength;
    let vectors = (n) => {
      return (
        [Math.sin(n * angle) * buttonDistance, Math.cos(n * angle) * buttonDistance]
      );
    };

    let changeTileButtons = () => {
      let buttons = tileList.map((item, n) => {
        let itemClone = R.clone(item);
        itemClone.borderColor = highlightColors[0];
        return (
          <TileBase
            key={itemClone.name + ' button'}
            center={polygonUtils.vectoradd(center, vectors(n))}
            edgeLength={buttonSize}
            name={itemClone.name}
            borderColor={itemClone.borderColor}
            handleTileClick={() => changeCurrentTile(i, itemClone.name)}
          />
        );
      });
      // Create an invisible rect button in the background to exit menu
      let backButtonSideSize = edgeLength * 10;
      let backButton = <rect
        x={center[0] - backButtonSideSize / 2}
        y={center[1] - backButtonSideSize / 2}
        width={backButtonSideSize}
        height={backButtonSideSize}
        fill='transparent'
        onClick={() => this.setState({ popup: null })} />;
      return (
        <g>
          {backButton}
          {buttons}
        </g>
      )
    };

    // function to change current tile.  Also brings up rotation menu
    let changeCurrentTile = (n, name) => {
      currentTiles[n].name = name;
      // rotationbuttons
      let rotateButtonWidth = edgeLength * 5;
      // function to enact rotations
      let tileRotate = (j) => {
        currentTiles[i].rotation = (currentTiles[i].rotation + j) % 6 || j % 6;
        this.setState({ tiles: currentTiles });
      };
      // rotate left button
      let leftButton = <rect
        x={center[0] - rotateButtonWidth}
        y={center[1] - rotateButtonWidth}
        width={rotateButtonWidth}
        height={2 * rotateButtonWidth}
        fill='transparent'
        onClick={() => {
          // this.setState({ popup: null });
          tileRotate(-1);
        }} />;
      // rotate right button
      let rightButton = <rect
        x={center[0]}
        y={center[1] - rotateButtonWidth}
        width={rotateButtonWidth}
        height={2 * rotateButtonWidth}
        fill='transparent'
        onClick={() => {
          // this.setState({ popup: null });
          tileRotate(1);
        }} />;
      // Buttons to accept rotation or go back
      let acceptAndBackWidths = 2 * edgeLength;
      let acceptAndBackHeights = edgeLength / 2;
      let rotateMessage = <g>
        <text x={center[0]} y={center[1] - 3 * acceptAndBackHeights} dominantBaseline="middle" textAnchor="middle" fontSize={edgeLength / 2.5} style={{ fill: 'black' }}>Click left or right to rotate</text>
      </g>;
      let acceptButton = <g onClick={() => this.setState({ tiles: currentTiles, popup: null })}>
        <rect width={acceptAndBackWidths} height={acceptAndBackHeights} x={center[0] - acceptAndBackWidths / 2} y={center[1] + 2.5 * acceptAndBackHeights} rx={edgeLength / 10} ry={edgeLength / 10} style={{ fill: 'green', strokeWidth: edgeLength / 40, stroke: 'black' }} />
        <text x={center[0]} y={center[1] + 3 * acceptAndBackHeights} dominantBaseline="middle" textAnchor="middle" fontSize={edgeLength / 2.5} style={{ fill: 'white' }}>Done</text>
      </g>;
      let backButton = <g onClick={() => { this.setState({ popup: changeTileButtons() }) }}>
        <rect width={acceptAndBackWidths} height={acceptAndBackHeights} x={center[0] - acceptAndBackWidths / 2} y={center[1] + 4 * acceptAndBackHeights} rx={edgeLength / 10} ry={edgeLength / 10} style={{ fill: 'maroon', strokeWidth: edgeLength / 40, stroke: 'black' }} />
        <text x={center[0]} y={center[1] + 4.5 * acceptAndBackHeights} dominantBaseline="middle" textAnchor="middle" fontSize={edgeLength / 2.5} style={{ fill: 'white' }}>Back</text>
      </g>;

      let leftrightButtons = <g>
        {rotateMessage}
        {leftButton}
        {rightButton}
        {acceptButton}
        {backButton}
      </g>;

      this.setState({
        tiles: currentTiles,
        popup: leftrightButtons,
      })
    }

    this.setState({
      popup: changeTileButtons()
    });

  }

  // code for downloading data from app, e.g. if you want to save the state of the tiles
  handleSaveToPC = (jsonData) => {
    let fileData = JSON.stringify(jsonData);
    let blob = new Blob([fileData], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = 'filename.json';
    link.href = url;
    link.click();
  }

  render() {

    let { tiles, popup } = this.state;

    // Find the maximum x position of any tile
    let nx = 0;
    tiles.forEach((item) => {
      let nxcurrent = (R.findIndex(a => a === item.position[0], alphabet) + 1) / 2;
      if (nxcurrent > nx) {
        nx = Math.ceil(nxcurrent);
      }
    });

    // Find the maximum y position of any tile
    let ny = 0;
    tiles.forEach((item) => {
      if (item.position[1] > ny) {
        ny = item.position[1];
      }
    });


    return (

      <div className="container">

        <h1>Polygons</h1>

        <Map
          style={{ backgroundColor: 'azure' }}
          edgeLength={edgeLength}
          origin={origin}
          nx={nx}
          ny={ny}
          tiles={tiles}
          handleTileClick={this.handleTileReplace}
          tilePositionToCenter={this.tilePositionToCenter}
          alphabet={alphabet}
        >
          {popup && popup}
        </Map>
      </div >

    );

  }; // render


}; //App





export default App;
