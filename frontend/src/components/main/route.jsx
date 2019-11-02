/* global _ */

import { Map, TileLayer, CircleMarker, Polyline, Marker } from "react-leaflet";
import React, { Component, PureComponent } from "react";

import Station from "./stations";
import * as geolib from "geolib";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import { connect } from "react-redux";
import iconTrain from "./map_icon";
import findIndex from "lodash/findIndex";
import TrainContainer from "./train_container";
import date from "date-and-time";
import NewMarker from "./marker";
import LiveTrains from "./live_trains";
import TrainMarkerContainer from "./train_marker_container";

const uuidv4 = require("uuid/v4");

let _ = require("lodash.indexof");
let toTime = require("to-time");

let flatten = require("array-flatten");

const routes = {
  1: {
    hexcolor: "#ffff33",
    destination: "Millbrae",
    abbreviation: ["MLBR", "SFIA"],
    direction: "South",
    color: "Yellow"
  },

  2: {
    hexcolor: "#ffff33",
    abbreviation: ["ANTC"],
    destination: "Antioch",
    direction: "North",
    color: "Yellow"
  },

  3: {
    hexcolor: "#ff9933",
    abbreviation: ["RICH"],
    destination: "Richmond",
    direction: "North",
    color: "Orange"
  },

  4: {
    hexcolor: "#ff9933",
    destination: ["Warm Springs"],
    abbreviation: ["WARM"],
    direction: "South",
    color: "Orange"
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY"]
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: ["Warm Springs"],
    abbreviation: "WARM",

    direction: "North"
  },

  7: {
    color: "Red",
    hexcolor: "#ff0000",

    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY", "MLBR"]
  },

  8: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "North",

    destination: "Richmond",
    abbreviation: ["RICH"]
  }
};

class Route extends Component {
  constructor(props) {
    super(props);

    // console.log(this.props);
    this.state = {
      waypoints: [],
      route: this.props.route,
      etas: [],
      routeID: null,
      updated: false,

      trains: [],
      trainAdded: null,
      trainAdded2: null,
      trainRemoved: null
      //   allStations: this.props.allStations
    };
    console.log(this.props);
    this.intervalId = null;
    this.handleChange = this.handleChange.bind(this);
    // this.getOrCreateRef = this.getOrCreateRef.bind(this);
    this.references = {};

    // this.state = { stations: this.props.selectedRoute.stations || [] };
  }

  // tick() {
  //   this.setState(prevState => ({
  //     seconds: prevState.seconds + 1
  //   }));
  // }

  componentDidMount() {
    const waypoints4 = this.props.waypoints;
    const etas = this.props.etas;

    const allTrains = this.props.trains;
    const route = this.props.route;
    const num = route.number;

    console.count();
    console.log(num);
    // this.props.getCurrentEtas("create", num);
    this.props.createTrains(route, this.props.etas);
    // this.props.renderStops();
    // this.props.drawPolyline();

    // this.props.updateTrains(num);
    // this.setState(prev => ({
    //   waypoints: prev.waypoints.concat([waypoints4])
    // }));

    //  this.props.saveTrains(this.props.trains, num);
    this.setState({ trains: this.props.trains });

    // this.setState(() => {
    //   let trains = this.props.trains || [];
    //   trains.map(ele => {
    //     return { [ele.id]: null };
    //   });
    // });

    // this.props.trains.map(train => {
    //   this.setState({ [train.id]: [] });
    // });

    //this.props.getCurrentEtas();

    // setTimeout(() => {
    //   this.setState({ trains: this.props.trains });
    //   //.then(result => {
    //   //   console.log(result);
    //   //   routeIds.map(id => {
    //   //     let route = this.props.routes[id];
    //   //     let etas = this.props.etas;
    //   //     console.log(route);
    //   //     console.log(etas);
    //   //     this.props.createTrains(route, etas);
    //   //   });
    //   // });
    // }, 0);

    // this.setState({ trains: allTrains });

    // this.intervalId3 = setInterval(() => {
    //   this.props.saveTrains(this.props.trains, num);
    // }, 17000);
  }

  // getOrCreateRef(id) {
  //   if (!this.references.hasOwnProperty(id)) {
  //     this.cont = React.createRef();
  //     this.references[id] = this.cont;
  //     this.props.handleRefs(this.cont);
  //   }
  //   return this.references[id];
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.etas !== nextProps.etas;
  // }

  componentWillUnmount() {
    const num = this.props.route.number;
    this.props.removeTrains(num);

    //this.props.getCurrentEtas();

    clearInterval(this.interval);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // Store prevId in state so we can compare when props change.
  //   // Clear out previously-loaded data (so we don't render stale stuff).
  //   // if (props.id !== state.prevId) {
  //   //   return {
  //   //     externalData: null,
  //   //     prevId: props.id,
  //   //   };
  //   // }
  //   // No state update necessary
  //   // return null;

  //   // if (nextProps.trains !== prevState.trains && prevState.trains !== []) {
  //   //   return { trains: [] };
  //   // }

  //   console.count();

  //   // if (prevState.routeID === null && nextProps.routeID) {
  //   //   {
  //   //     nextProps.updateTrains(nextProps.route.number);
  //   //     return {
  //   //       routeID: nextProps.routeID
  //   //     };
  //   //   }
  //   // }

  //   // if (
  //   //   prevState.routeID === nextProps.routeID &&
  //   //   prevState.trains.length !== 0 &&
  //   //   nextProps.trains.length === prevState.trains.length + 1
  //   // ) {
  //   //   let addedIndex = findIndex(nextProps.trains, "firstTrain");
  //   //   let abc = nextProps.trains.slice();
  //   //   let train = prevState.trains[addedIndex];
  //   //   let abc2 = abc.concat(train);
  //   //   let abc3 = [];
  //   //   abc2.map((ele, idx) => {
  //   //     if (idx !== addedIndex) {
  //   //       abc3.push(ele);
  //   //     }
  //   //   });
  //   //   console.log(nextProps.trains);
  //   //   console.log(addedIndex);
  //   //   let addedTrain = nextProps.trains[addedIndex];
  //   //   return {
  //   //     trainAdded: addedIndex,

  //   //     trains: abc3
  //   //   };
  //   // }
  //   // if (
  //   //   prevState.routeID === nextProps.routeID &&
  //   //   nextProps.trains.length !== 0 &&
  //   //   nextProps.trains.length === prevState.trains.length - 1
  //   // ) {
  //   //   let removedIndex = findIndex(prevState.trains, "lastTrain");
  //   //   console.log(removedIndex);
  //   //   let copy = prevState.trains.slice();
  //   //   copy[removedIndex] = undefined;

  //   //   return {
  //   //     trains: copy,

  //   //     trainRemoved: removedIndex
  //   //   };
  //   // }

  //   // if (
  //   //   prevState.routeID === nextProps.routeID &&
  //   //   prevState.trains !== nextProps.trains
  //   // ) {
  //   //   console.count();
  //   //   console.log(prevState, nextProps);
  //   //   return {
  //   //     trains: []
  //   //   };
  //   // }
  //   console.log(nextProps, prevState);
  //   return null;
  // }

  shouldComponentUpdate(nextProps, nextState) {
    console.count();
    return (
      this.props.etas !== nextProps.etas ||
      this.state.trains !== nextProps.trains
    );
  }

  handleChange(id, location) {
    console.count();
    this.setState({ [id]: location });
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState);
    // const allTrains = this.props.trains.slice();
    const num = this.props.route.number;
    const stations = this.props.route.stations;
    const etas = this.props.etas;
    const route = this.props.route;

    // if (this.state.trains !== prevState.trains && prevState.trains !== null) {
    //   console.count();
    //   // this.setState({ trains: this.props.trains });
    //   this.props.saveTrains(this.props.trains, num);
    // }

    // if (this.props.newTrains.length > prevProps.newTrains.length) {
    //   let trains3 = this.props.newTrains.concat(this.props.trains);
    //   this.props.saveTrains(trains3, num);
    // }

    // if (prevProps.trains === undefined && this.props.trains) {
    //   console.count();
    //   this.props.trains.map(ele => {
    //     this.setState({ [ele.id]: [] });
    //   });
    // }

    if (this.state.trains !== this.props.trains) {
      console.count(num);
      console.log(num);
      console.count();

      this.setState({ trains: this.props.trains });
    }

    // if (this.state.trains !== prevState.trains && !prevState.trains) {
    //   console.log(this.references);
    //   const newRefernces = Object.keys(this.references).map(ele => {
    //     if (this.references[ele].current !== null) {
    //       return ele;
    //     }
    //   });
    //   if (newRefernces.length > 0) {
    //     console.log(newRefernces);
    //     this.props.handleRefs(this.references);
    //   }
    // }

    // if (
    //   prevState.trains &&
    //   this.state.trains &&
    //   prevState.trains !== this.state.trains
    // ) {
    //   this.props.addTrains(route, this.state.trains, this.props.etas);
    // }

    // if (
    //   this.state.trains === prevProps.trains &&
    //   this.state.trains === prevState.trains
    //   // &&
    //   // prevProps.trains !== this.props.trains
    // ) {
    //   console.count(num);
    //   console.log(num);
    //   console.count();

    //   this.props.saveTrains(this.props.trains, num);
    // }

    // if (this.props.etas !== prevProps.etas) {
    //   this.props.updateTrains(num, this.props.etas, stations);
    // }

    if (prevProps.etas !== this.props.etas && prevProps.etas) {
      console.count();
      //return this.setState({ trains: this.props.trains });
      this.props.updateTrains(num, etas, stations);
      //this.setState({ etas: this.props.etas });
    }
  }

  //   // if (this.state.trainAdded !== null) {
  //   //   let idx = this.state.trainAdded;

  //   //   let stateTrain = this.props.trains.slice();
  //   //   let test = stateTrain.splice(idx, 1);
  //   //   console.log(test);
  //   //   stateTrain.concat([test]);
  //   //   console.log(stateTrain);
  //   //   return this.setState({
  //   //     trains: stateTrain,
  //   //     trainAdded: null
  //   //   });
  //   // }

  //   // if (this.state.trainRemoved !== null) {
  //   //   let idx = this.state.trainRemoved;
  //   //   console.log(prevProps);
  //   //   let stateTrains3 = prevProps.trains.slice();
  //   //   stateTrains3[idx] = undefined;
  //   //   return this.setState({ trains: stateTrains3, trainRemoved: null });
  //   // }
  //   // if (allTrains.length) {
  //   //   console.count();
  //   //   this.setState({ trains: this.props.trains });
  //   // }
  // }

  // // addTrains(value) {
  // //   const trains = this.state.trains;
  // //   const newTrains = trains.concat([value]);
  // //   return this.setState({ trains: newTrains });
  // // }

  // // renderStops() {
  // //   const allStations = this.props.allStations;
  // //   const schedule = this.props.schedule;
  // //   const route = this.props.route;
  // //   const routeNumber = route.number;

  // //   const color = routes[routeNumber].color;
  // //   const hexcolor = routes[routeNumber].hexcolor;
  // //   const selections = this.props.currentColors;
  // //   const count = selections[color];

  // //   if (!route.stations.length === 0) {
  // //     return <p>loading</p>;
  // //   } else if (count === 1) {
  // //     return (
  // //       <div>
  // //         {route.stations.map(ele2 => {
  // //           let station = allStations[ele2.stationName];
  // //           let abbr = station.abbr;
  // //           return (
  // //             <Station
  // //               station={station}
  // //               hexcolor={hexcolor}
  // //               key={abbr}
  // //             ></Station>
  // //           );
  // //         })}
  // //       </div>
  // //     );
  // //   }
  // // }

  // // drawPolyline() {
  // //   // console.log(this.state);
  // //   const route = this.props.route;
  // //   const hexcolor = route.hexcolor;
  // //   const routeNumber = route.number;

  // //   const color = routes[routeNumber].color;
  // //   const selections = this.props.currentColors;
  // //   const count = selections[color];

  // //   if (count === 1) {
  // //     const waypoints3 = [this.props.waypoints];
  // //     return waypoints3.map(ele => {
  // //       return <Polyline positions={ele.waypoints} key={hexcolor} />;
  // //     });
  // //   }
  // // }

  render() {
    // console.log(this.props);
    const route = this.props.route;
    const color = route.hexcolor;
    const routeID = this.props.routeID;

    const trains = this.state.trains;

    console.log(trains);

    console.log(this.state);
    console.log(this.props.trains);
    const id2 = uuidv4();

    if (!trains) {
      return <p>loading</p>;
    }
    // console.log(newRouteStations);
    else {
      {
        return (
          <div>
            {/* {this.props.renderStops()}

            {this.props.drawPolyline()} */}

            {trains.length > 0 ? (
              trains.map((train, idx) => {
                console.log(train);
                if (train) {
                  let slice = train.currentSlice;
                  console.log(train);
                  console.log(train.pos, train.stationName);
                  let lastLocation = train.lastLocation;
                  let routeStation = route.stations[train.stationIdx];
                  //this.ref = this.getOrCreateRef(train.id);
                  let id = train.id;
                  let nextStationId;
                  //let lastLocation = this.state[id];

                  // if (!Array.isArray(train.currentSlice[0])) {
                  //   slice = [
                  //     train.currentSlice,
                  //     train.currentSlice,
                  //     train.currentSlice,
                  //     train.currentSlice,
                  //     train.currentSlice,
                  //     train.currentSlice,
                  //     train.currentSlice
                  //   ];
                  // }
                  console.log(slice);
                  console.log(train);
                  console.log(this.references);

                  return (
                    // <TrainMarkerContainer
                    //   train={train}
                    //   key={id}
                    //   id={id}
                    //   station={train.stationName}
                    //   routeNumber={this.props.routeNumber}
                    //   minutes={train.minutes}
                    //   pos={train.pos}
                    // ></TrainMarkerContainer>
                    // <Marker
                    //   position={train.pos}
                    //   key={idx}
                    //   icon={iconTrain}
                    // ></Marker>
                    <NewMarker
                      //   markers={slice}
                      // seconds={this.props.seconds}
                      color={color}
                      station={train.stationName}
                      minutes={train.minutes}
                      id={id}
                      waypoints={train.waypoints}
                      // stationSlice={train.stationSlice}
                      //   ratio={train.ratio}
                      key={id}
                      routeStations={route.stations}
                      index={train.stationIdx}
                      routeNumber={this.props.routeNumber}
                      train={train}
                      //  interval={train.interval}
                      // initialCoordinates={train.initialCoordinates}
                      // initialPosition={train.initialPosition}
                      // ref={this.ref}
                      references={this.references}
                      //getOrCreateRef={this.getOrCreateRef}
                      // initialSlice={train.initialSlice}
                      // removeTrain={this.props.removeTrain}
                      //lastLocation={this.state[id]}
                      //handleChange={this.handleChange}
                      // lastLocation={lastLocation}
                      // nextStationId={nextStationId}
                    ></NewMarker>
                  );
                }
              })
            ) : (
              <div></div>
            )}
          </div>
        );
      }
    }
  }
}

// const msp = state => ({ etas: state.etas });

// export default connect(
//   msp,
//   null
// )(Route);

/* <LiveTrains
  trains={trains}
  routeStations={routeStations}
  // destination={currentDestination3}
  hexcolor={routeHexColor}
  direction={routeDirection}
  routeNumber={routeNumber}
  schedule={this.props.schedule}
  stationObj={stationsObj}
  waypoints={waypoints2}
  fetchStationDepartures={this.props.fetchStationDepartures}
  routeNumber={routeNumber}
  addTrains={this.addTrains}
/> */
export default Route;
