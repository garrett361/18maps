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

// Set grid parameters.  All dimensions should key off of edgelength
let edgelength = 40;
let origin = [2 * edgelength, 4 * edgelength];
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
    { position: ['H', 6], name: 'blank' },
  ],
};

class App extends Component {

  state = initialState;

  // from the initial state, dynamically generate map size
  mapDimensions = () => {
    let { tiles } = this.state;
    let dimensions = {};
    dimensions.nx = 0;
    dimensions.ny = 0;

    tiles.forEach((item) => {
      let nxcurrent = (R.findIndex(a => a === item.position[0], alphabet) + 1) / 2;
      if (nxcurrent > dimensions.nx) {
        dimensions.nx = Math.ceil(nxcurrent);
      }
    });

    // Find the maximum y position of any tile
    tiles.forEach((item) => {
      if (item.position[1] > dimensions.ny) {
        dimensions.ny = item.position[1];
      }
    });

    return (dimensions);
  }

  // Positioning system. Maps coordinates in, e.g., [A,13] form to svg coordinates
  tilePositionToCenter = (position) => {

    let nx = R.clone(this.mapDimensions().nx);
    let ny = R.clone(this.mapDimensions().ny);

    // create grid grid hex grid points based on tile data gathered above
    // hexGridFlat creates nx*ny grid points built in ny rows
    // where the odd numbered rows are offset
    let gridpoints = polygonUtils.hexGridFlat(nx, ny, origin, edgelength);


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
    let buttonSize = edgelength / 2;
    let buttonDistance = 5 / 3 * edgelength;
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
            edgelength={buttonSize}
            name={itemClone.name}
            borderColor={itemClone.borderColor}
            handleTileClick={() => changeCurrentTile(i, itemClone.name)}
          />
        );
      });
      // Create an invisible rect button in the background to exit menu
      let backButtonSideSize = edgelength * 10;
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
      let rotateButtonWidth = edgelength * 5;
      // function to enact rotations
      let tileRotate = (j) => {
        currentTiles[i].rotation === undefined
          ?
          currentTiles[i].rotation = j % 6
          :
          currentTiles[i].rotation = (currentTiles[i].rotation + j) % 6
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
          tileRotate(1);
        }} />;
      // Buttons to accept rotation or go back
      let acceptAndBackWidths = 2 * edgelength;
      let acceptAndBackHeights = edgelength / 2;
      // rotation arrows for UI
      let arrowXOffset = edgelength;
      let arrowYOffset = edgelength;
      let arrowDimension = edgelength / 10;
      let arrowColor = 'indigo';
      let clockwiseArrow = <svg>
        <defs>
          <marker
            id="markerArrow"
            refX={arrowDimension / 2}
            refY={arrowDimension / 2}
            markerWidth={arrowDimension * 10}
            markerHeight={arrowDimension * 10}
            fill={arrowColor}
            orient="auto-start-reverse">
            <path d={"M 0 0 L " + arrowDimension + " " + arrowDimension / 2 + " L 0 " + arrowDimension + " z"} />
          </marker>
        </defs>
        <path
          d={"M " + (center[0] + arrowXOffset) + " " + (center[1] - arrowYOffset) + " " +
            "A " + edgelength * 2 + " " + edgelength * 2 + " 0 0 1 " + (center[0] + arrowXOffset) + " " + (center[1] + arrowYOffset)}
          fill="transparent"
          stroke={arrowColor}
          strokeWidth={edgelength / 10}
          strokeLinecap='butt'
          markerEnd="url(#markerArrow)"
        />
      </svg>;
      let counterclockwiseArrow = <svg>
        <defs>
          <marker
            id="markerArrow"
            refX={arrowDimension / 2}
            refY={arrowDimension / 2}
            markerWidth={arrowDimension}
            markerHeight={arrowDimension}
            fill={arrowColor}
            orient="auto-start-reverse">
            <path d={"M 0 0 L " + arrowDimension + " " + arrowDimension / 2 + " L 0 " + arrowDimension + " z"} />
          </marker>
        </defs>
        <path
          d={"M " + (center[0] - arrowXOffset) + " " + (center[1] - arrowYOffset) + " " +
            "A " + edgelength * 2 + " " + edgelength * 2 + " 0 0 0 " + (center[0] - arrowXOffset) + " " + (center[1] + arrowYOffset)}
          fill="transparent"
          stroke={arrowColor}
          strokeWidth={edgelength / 10}
          strokeLinecap='butt'
          markerEnd="url(#markerArrow)"
        />
      </svg>;
      // buttons
      let acceptButton = <g onClick={() => this.setState({ tiles: currentTiles, popup: null })}>
        <rect width={acceptAndBackWidths} height={acceptAndBackHeights} x={center[0] - acceptAndBackWidths / 2} y={center[1] + 2.5 * acceptAndBackHeights} rx={edgelength / 10} ry={edgelength / 10} style={{ fill: 'green', strokeWidth: edgelength / 40, stroke: 'black' }} />
        <text x={center[0]} y={center[1] + 3 * acceptAndBackHeights} dominantBaseline="middle" textAnchor="middle" fontSize={edgelength / 2.5} style={{ fill: 'white' }}>Done</text>
      </g>;
      let backButton = <g onClick={() => { this.setState({ popup: changeTileButtons() }) }}>
        <rect width={acceptAndBackWidths} height={acceptAndBackHeights} x={center[0] - acceptAndBackWidths / 2} y={center[1] + 4 * acceptAndBackHeights} rx={edgelength / 10} ry={edgelength / 10} style={{ fill: 'maroon', strokeWidth: edgelength / 40, stroke: 'black' }} />
        <text x={center[0]} y={center[1] + 4.5 * acceptAndBackHeights} dominantBaseline="middle" textAnchor="middle" fontSize={edgelength / 2.5} style={{ fill: 'white' }}>Back</text>
      </g>;

      let leftrightButtons = <g>
        {clockwiseArrow}
        {counterclockwiseArrow}
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

  }; //handleTileReplace

  // handling route selecting and highlightlighting
  handleRouteSelect = (i, highlightNumber) => {
    // i is the track index, highlightNumber defaults to zero and controls the highlight color
    // as well as the size of the highlights
    let { selectedRoute } = this.state;

    let highlight = 0;
    if (highlightNumber) {
      highlight = highlightNumber
    };

    // Grab current tile info
    let currentTiles = this.state.tiles;

    // check for previous route info and add selected tile index to route
    // if re-clicking on last selected tile, delete from list
    let previousRoute = [];
    if (selectedRoute) { previousRoute = selectedRoute };
    let updatedRoute = [...previousRoute];
    if (i === previousRoute[previousRoute.length - 1]) {
      if (previousRoute.length === 1) {
        updatedRoute = [];
      } else { updatedRoute = R.dropLast(1, updatedRoute) }
    } else { updatedRoute = [...previousRoute, i] };



    // generate svg coordinates of points and their values, if there is a path
    if (updatedRoute.length) {
      let updatedRouteCoordinatesAndValues = updatedRoute.map((item) => {
        return ({
          position: this.tilePositionToCenter(currentTiles[item].position),
          values: currentTiles[item].values
        })
      });

      // create an SVG path from the coordinates
      // successive paths are thinner
      let updatedRouteCoordinatesSVGPath = R.reduce((a, b) => { return (a + " L " + b.position[0] + " " + b.position[1]) }, "M " + updatedRouteCoordinatesAndValues[0].position + " ", R.drop(1, updatedRouteCoordinatesAndValues))
      let pathCircleRadius = edgelength * (1 - .05 * highlight) / 6;
      let pathCircleStroke = edgelength * (1 - .05 * highlight) / 22;
      let updatedRouteCoordinatesSVGPathElement =
        <g>
          <path
            d={updatedRouteCoordinatesSVGPath}
            fill='transparent'
            stroke={highlightColors[highlight]}
            strokeWidth={pathCircleRadius}
            strokeLinejoin='round'
          />
          <circle cx={updatedRouteCoordinatesAndValues[0].position[0]} cy={updatedRouteCoordinatesAndValues[0].position[1]} r={pathCircleRadius} fill='green' stroke={highlightColors[0]} strokeWidth={pathCircleStroke} />
          {updatedRouteCoordinatesAndValues.length > 1 && <circle cx={updatedRouteCoordinatesAndValues[updatedRouteCoordinatesAndValues.length - 1].position[0]} cy={updatedRouteCoordinatesAndValues[updatedRouteCoordinatesAndValues.length - 1].position[1]} r={pathCircleRadius} fill='red' stroke={highlightColors[0]} strokeWidth={pathCircleStroke} />}
        </g>;

      this.setState({
        selectedRoute: updatedRoute,
        popup: updatedRouteCoordinatesSVGPathElement,
      })
    } else {
      this.setState({
        selectedRoute: updatedRoute,
        popup: null,
      })
    };

  }//handleRouteSelect

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

    // Map dimensions
    let nx = R.clone(this.mapDimensions().nx);
    let ny = R.clone(this.mapDimensions().ny);

    return (

      <div className="container">

        <h1>Polygons</h1>

        <Map
          style={{ backgroundColor: 'azure' }}
          edgelength={edgelength}
          origin={origin}
          nx={nx}
          ny={ny}
          tiles={tiles}
          trains={[
            { name: 'D', color: 'green' },
            { name: '5', color: 'green' },
            { name: '1', color: 'green' },
            { name: '10', color: 'green' },
            { name: '1', color: 'green' },
          ]}
          handleTileClick={this.handleRouteSelect}
          tilePositionToCenter={this.tilePositionToCenter}
          alphabet={alphabet}
          highlightColors={highlightColors}
        >
          {popup && popup}
        </Map>
      </div >

    );

  }; // render


}; //App





export default App;
