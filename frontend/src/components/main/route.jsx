/* global _ */

import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component, PureComponent } from "react";

import Station from "./stations";
import * as geolib from "geolib";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import { connect } from "react-redux";

import findIndex from "lodash/findIndex";
import TrainContainer from "./train_container";
import date from "date-and-time";
import LiveTrains from "./live_trains";
import NextStationsReducer from "../../reducers/next_station_reducer_nb";
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

class Route extends PureComponent {
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

    // this.state = { stations: this.props.selectedRoute.stations || [] };
  }

  componentDidMount() {
    const waypoints4 = this.props.waypoints;
    const etas = this.props.etas;
    const num = this.props.route.number;
    const allTrains = this.props.trains;

    console.count();
    // this.props.getCurrentEtas();

    this.props.updateTrains(num);
    // this.setState(prev => ({
    //   waypoints: prev.waypoints.concat([waypoints4])
    // }));

    // this.intervalId = setInterval(() => {
    //   this.props.updateTrains(num);
    // }, 25000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    // if (props.id !== state.prevId) {
    //   return {
    //     externalData: null,
    //     prevId: props.id,
    //   };
    // }
    // No state update necessary
    // return null;

    // if (nextProps.trains !== prevState.trains && prevState.trains !== []) {
    //   return { trains: [] };
    // }

    console.count();

    // if (prevState.routeID === null && nextProps.routeID) {
    //   {
    //     nextProps.updateTrains(nextProps.route.number);
    //     return {
    //       routeID: nextProps.routeID
    //     };
    //   }
    // }

    // if (
    //   prevState.routeID === nextProps.routeID &&
    //   prevState.trains.length !== 0 &&
    //   nextProps.trains.length === prevState.trains.length + 1
    // ) {
    //   let addedIndex = findIndex(nextProps.trains, "firstTrain");
    //   let abc = nextProps.trains.slice();
    //   let train = prevState.trains[addedIndex];
    //   let abc2 = abc.concat(train);
    //   let abc3 = [];
    //   abc2.map((ele, idx) => {
    //     if (idx !== addedIndex) {
    //       abc3.push(ele);
    //     }
    //   });
    //   console.log(nextProps.trains);
    //   console.log(addedIndex);
    //   let addedTrain = nextProps.trains[addedIndex];
    //   return {
    //     trainAdded: addedIndex,

    //     trains: abc3
    //   };
    // }
    // if (
    //   prevState.routeID === nextProps.routeID &&
    //   nextProps.trains.length !== 0 &&
    //   nextProps.trains.length === prevState.trains.length - 1
    // ) {
    //   let removedIndex = findIndex(prevState.trains, "lastTrain");
    //   console.log(removedIndex);
    //   let copy = prevState.trains.slice();
    //   copy[removedIndex] = undefined;

    //   return {
    //     trains: copy,

    //     trainRemoved: removedIndex
    //   };
    // }

    // if (
    //   prevState.routeID === nextProps.routeID &&
    //   prevState.trains !== nextProps.trains
    // ) {
    //   console.count();
    //   console.log(prevState, nextProps);
    //   return {
    //     trains: []
    //   };
    // }
    console.log(nextProps, prevState);
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState);
    const allTrains = this.props.trains.slice();
    const num = this.props.route.number;

    if (
      // prevProps.trains === this.props.trains &&
      this.props.etas !== prevProps.etas
    ) {
      console.count();
      // this.setState({ trains: this.props.trains });
      return this.props.updateTrains(num);
    }
    if (prevProps.trains !== this.props.trains) {
      console.count();
      return this.setState({ trains: this.props.trains });
      // this.props.updateTrains(num);
    }

    // if (this.state.trainAdded !== null) {
    //   let idx = this.state.trainAdded;

    //   let stateTrain = this.props.trains.slice();
    //   let test = stateTrain.splice(idx, 1);
    //   console.log(test);
    //   stateTrain.concat([test]);
    //   console.log(stateTrain);
    //   return this.setState({
    //     trains: stateTrain,
    //     trainAdded: null
    //   });
    // }

    // if (this.state.trainRemoved !== null) {
    //   let idx = this.state.trainRemoved;
    //   console.log(prevProps);
    //   let stateTrains3 = prevProps.trains.slice();
    //   stateTrains3[idx] = undefined;
    //   return this.setState({ trains: stateTrains3, trainRemoved: null });
    // }
    // if (allTrains.length) {
    //   console.count();
    //   this.setState({ trains: this.props.trains });
    // }
  }

  // addTrains(value) {
  //   const trains = this.state.trains;
  //   const newTrains = trains.concat([value]);
  //   return this.setState({ trains: newTrains });
  // }

  renderStops() {
    const allStations = this.props.allStations;
    const schedule = this.props.schedule;
    const route = this.props.route;
    const routeNumber = route.number;

    const hexcolor = routes[routeNumber].hexcolor;
    console.log(hexcolor);
    if (!route.stations.length === 0) {
      return <p>loading</p>;
    } else {
      return (
        <div>
          {route.stations.map(ele2 => {
            let station = allStations[ele2.stationName];
            let abbr = station.abbr;
            return (
              <Station
                station={station}
                hexcolor={hexcolor}
                key={abbr}
              ></Station>
            );
          })}
        </div>
      );
    }
  }

  drawPolyline() {
    // console.log(this.state);
    const route = this.props.route;
    const hexcolor = route.hexcolor;

    const waypoints3 = [this.props.waypoints];
    return waypoints3.map(ele => {
      return <Polyline positions={ele.waypoints} key={hexcolor} />;
    });
  }

  render() {
    // console.log(this.props);
    const route = this.props.route;
    const color = route.hexcolor;
    const routeID = this.props.routeID;

    const trains = this.state.trains;

    console.log(trains);

    console.log(this.state);
    console.log(this.props);
    const id2 = uuidv4();

    if (!trains) {
      return <p>loading</p>;
    }
    // console.log(newRouteStations);
    else {
      {
        return (
          <div>
            {this.renderStops()}

            {this.drawPolyline()}

            {trains.length > 0 ? (
              trains.map((train, idx) => {
                if (train) {
                  let slice = train.currentSlice.slice();
                  console.log(train);
                  let lastLocation = train.lastLocation;

                  let id = train.id;
                  let nextStationId;

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
                  return (
                    <TrainContainer
                      markers={slice}
                      color={color}
                      station={train.station}
                      interval={30000}
                      id={id}
                      key={id}
                      lastLocation={lastLocation}
                      nextStationId={nextStationId}
                    ></TrainContainer>
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
