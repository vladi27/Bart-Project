import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component } from "react";
import LiveTrain from "./live_train";
import merge from "lodash/merge";
let flatten = require("array-flatten");

class LiveTrains extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    // this.state = {
    //  allTrains: []
    //   }
    // };
    // this.state = {
    //   destinations: []
    // };

    // this.state = { stations: this.props.selectedRoute.stations || [] };
  }

  //   componentDidMount() {
  //     const departuringTrain = this.props.train;
  //     this.setState(prev => {
  //       if (prev.destinations.indexOf(this.props.destination) === -1) {
  //         return {
  //           destinations: prev.destinations.concat([this.props.destination])
  //         };
  //       }
  //     });
  //   }

  handleRoute() {
    let allDepartures = this.props.trains;
    const hexcolor = this.props.hexcolor;
    const direction = this.props.direction;
    const waypoints = this.props.waypoints;
    const routeStations = this.props.routeStations;
    console.log(allDepartures);

    const scheduleArray = this.props.schedule.arr;
    const stationObj = this.props.stationObj;
    // const alld2 = allDepartures.map(ele => {
    //   return ele.departures.map(ele2 => {
    //     if (ele2["hexcolor"] === hexcolor && ele2["direction"] === direction) {
    //       return ele;
    //     }
    //   });
    // });

    if (this.props.routeNumber === "2") {
      allDepartures = allDepartures.slice(0, -2);
    }
    if (this.props.routeNumber === "1") {
      allDepartures = allDepartures.slice(2);
    }

    const alld3 = [];
    console.log(allDepartures);

    // alld2.forEach(ele => {
    //   if (ele.indexOf(undefined)) {
    //     alld3.push(ele);
    //   }
    // });
    let obj = {};
    allDepartures.map(ele => {
      if (!obj[ele.destination]) {
        obj[ele.destination] = [ele];
      } else {
        obj[ele.destination].push(ele);
      }
    });
    console.log(obj);

    let allDepartureskeys = Object.keys(obj);
    let currentRoutes = [];
    allDepartureskeys.forEach(key => {
      currentRoutes.push(obj[key]);
    });

    console.log(currentRoutes);
    return currentRoutes.map((route, idx) => {
      //   route = route.slice(idx + 3);
      let k = 0;
      route = route.slice(k);
      console.log(route);
      let totalRouteLength = scheduleArray[0].timeToDestination;
      return route.map((station, idx2) => {
        console.log(idx2);
        console.log(station);
        let routeLength = route.length;
        let stationName = station.currentName;
        let prevStationDepartures;
        let prevStation = route[idx2 - 1];

        let previousStationName;
        if (
          stationObj[stationName].previousStation &&
          prevStation &&
          prevStation.departures
        ) {
          prevStationDepartures = prevStation.departures;
          console.log(stationName, prevStationDepartures);
          previousStationName = stationObj[stationName].previousStation;
        }
        let currentDestination = stationObj[station.destination];

        let currentDestinationIdx = routeStations.indexOf(currentDestination);
        let routeToFollow = route.slice(0, currentDestinationIdx + 1);

        console.log(previousStationName);
        // console.log(routeToFollow);

        // console.log(route);

        // console.log(station);
        // console.log(totalRouteLength);

        // console.log(station, idx2);
        // console.log(currentDestination);
        let providedDestination =
          scheduleArray[scheduleArray.length - 1].stationName;
        // console.log(providedDestination);
        let currentDepartures = station.departures;
        console.log(currentDepartures, stationName);
        let currentDeparturesCopy = station.departures.slice();
        let j = 0;
        return currentDepartures.map((departure, idx3) => {
          if (departure.hexcolor === "#c463c5") {
            return;
          } else if (
            departure.hexcolor === hexcolor &&
            departure.direction === direction
          ) {
            return (
              <LiveTrain
                departure={departure.minutes}
                station={station}
                stationId={idx2}
                departureID={idx3}
                prevStationName={previousStationName}
                allStations={stationObj}
                firstStation={routeStations[0]}
                waypoints={this.props.waypoints}
                currentDestination={currentDestination}
                hexcolor={hexcolor}
                prevStationDepartures={prevStationDepartures}
                routeLength={routeLength}
              />
            );
          }
        });
      });
    });
  }

  render() {
    // const station = this.props.station;

    // console.log(this.state);
    // let station2Lat = parseFloat(station.gtfs_latitude);
    // let station2Long = parseFloat(station.gtfs_longitude);
    // let arr = [station2Lat, station2Long];
    return (
      // <CircleMarker
      //     key={`marker-${station.abbr}`}
      //     center={arr}
      //     radius={10}
      // ></CircleMarker>
      <div>{this.handleRoute()}</div>
    );
  }
}

export default LiveTrains;
