/* global _ */

import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component, PureComponent } from "react";
import { connect } from "react-redux";
import Station from "./stations";
import * as geolib from "geolib";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import TrainContainer from "./train_container";
import date from "date-and-time";
import LiveTrains from "./live_trains";

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
    this.state = { waypoints: [] };

    // this.state = { stations: this.props.selectedRoute.stations || [] };
  }

  componentDidMount() {
    const waypoints4 = this.props.waypoints;

    this.setState(prev => ({
      waypoints: prev.waypoints.concat([waypoints4])
    }));
    // this.setState({ route: this.props.route });
  }

  renderStops() {
    const allStations = this.props.allStations;
    const schedule = this.props.schedule;
    const route = this.props.route;
    return (
      <div>
        {route.stations.map(ele2 => {
          let station = allStations[ele2];
          return (
            <Station station={station} key={`marker-${station.abbr}`}></Station>
          );
        })}
      </div>
    );
  }

  drawPolyline() {
    // console.log(this.state);
    const waypoints3 = this.state.waypoints;
    return waypoints3.map(ele => {
      return <Polyline positions={ele.waypoints} />;
    });
  }

  renderTrains() {
    const allStations = this.props.allStations;
    const waypoints2 = this.props.waypoints;
    const schedule = this.props.schedule;
    const scheduleObj = this.props.schedule.obj;
    const route = this.props.route;
    const routeNumber = route.number;
    const routeDestination = routes[routeNumber].abbreviation;
    const routeHexColor = routes[routeNumber].hexcolor;
    const routeDirection = routes[routeNumber].direction;
    // console.log(routeDestination);
    const count = [];
    const trains = [];
    const departures = {};
    let currentDestination3;
    let stationsObj = {};

    const routeStations = route.stations;
    let newRouteStationObj = {};
    const newRouteStations = routeStations.map(ele => {
      let station2 = allStations[ele];
      newRouteStationObj[ele] = station2;
      return station2;
    });

    // console.log(newRouteStations);

    // let abc = newRouteStations.map(station => {
    //   let results = [];
    //   station["nextTrains"] = results;

    //   return station.etd.forEach(destination => {
    //     console.log(destination);
    //     if (routeDestination.includes(destination.abbreviation)) {
    //       return (station["next"] = destination);
    //     }
    //   });
    // });

    let stationEtds = newRouteStations.map(station => {
      let obj = {};
      obj["departures"] = station.etd;
      obj["name"] = station.abbr;
      return obj;
    });

    // console.log(stationEtds);

    let currentDestination;

    const arr = [];
    stationEtds.forEach(ele => {
      //   console.log(ele);
      //   let obj = {};

      let allDepartures = ele.departures;
      if (allDepartures) {
        allDepartures.forEach(ele2 => {
          //   console.log(ele2);

          let dist = ele2.abbreviation;

          //   console.log(dist);
          //   console.log(routeDestination);
          let anc = [];

          //   console.log(routeDestination.includes(String(dist)));

          if (routeDestination.includes(String(dist))) {
            // console.log("hi");
            anc.push(ele2);
            let trains = ele.trains || [];
            let newt = trains.concat(anc);
            // console.log(newt);
            // ele["currentDestination"] = dist;
            ele["trains"] = newt;

            let abcd = { [ele.name]: ele };
            obj = merge({}, abcd, ele);
          }
        });
      }
      let newe = merge({}, { [ele.name]: ele, obj });

      //   if (Object.values(obj).length === 0) {
      //     arr.push({ [ele.name]: ele });
      //   } else {
      //     arr.push(obj);
      //   }

      arr.push(obj);
      return arr;
    });

    // console.log(arr);

    let newTrainsObj = {};

    arr.forEach(ele => {
      if (ele) {
        newTrainsObj[ele.name] = ele;
      }
    });

    let newTrainsObj2 = {};

    // arr.forEach(ele => {
    //   console.log(ele);
    //   if (ele.trains) {
    //     ele.trains.forEach(ele2 => {
    //       console.log(ele2);
    //       ele2.estimate.map(ele3 => {
    //         console.log(ele3);
    //         newTrainsObj2[ele2.abbreviation] = ele3;
    //         // return merge({}, { [newTrainsObj2[ele2.abbreviation]]: ele3 });
    //       });
    //     });
    //   }
    // });

    // console.log(newTrainsObj2);

    const newUpdatedRoutes = newRouteStations.map((ele, idx) => {
      let obj3 = {};
      let stationWithDepartures = newTrainsObj[ele.abbr];
      //   console.log(stationWithDepartures);
      // let obj5 = obj3[[ele.abbr]];

      // let departures = arr[name];
      //   console.log(obj3);

      //   console.log(arr);
      if (
        stationWithDepartures &&
        stationWithDepartures["trains"] !== undefined
      ) {
        ele["trains"] = stationWithDepartures["trains"];
      }
      let station2 = allStations[ele.abbr];
      let station2Lat = parseFloat(station2.gtfs_latitude);
      let station2Long = parseFloat(station2.gtfs_longitude);
      let arr2 = [station2Lat, station2Long];
      ele["location"] = arr2;
      return ele;
    });

    // console.log(newUpdatedRoutes);
    // console.log(schedule);

    const routesWithSchedules = newUpdatedRoutes.map((ele, idx) => {
      let scheduleData = scheduleObj[ele.abbr];

      if (idx === 0) {
        ele["timeToDestination"] = scheduleData.timeToDestination;
        ele["timeToNextStation"] = scheduleData.timeToNextStation;
        ele["nextStation"] = scheduleData.nextStationName;
      } else if (idx === newUpdatedRoutes.length - 1) {
        ele["previousStaion"] = scheduleData.previousStationName;
      } else {
        ele["timeToDestination"] = scheduleData.timeToDestination;
        ele["timeToNextStation"] = scheduleData.timeToNextStation;
        ele["nextStation"] = scheduleData.nextStationName;
        ele["previousStation"] = scheduleData.previousStationName;
      }

      return ele;
    });

    // newRouteStations.forEach((ele, idx) => {
    //   let scheduleData = schedule[idx];

    //   if (scheduleData && scheduleData.timeToNextStation) {
    //     ele["timeToNextStation"] = scheduleData.timeToNextStation;
    //     ele["nextStation"] = scheduleData.nextStationName;
    //   }
    // });

    let obj = {};

    routesWithSchedules.forEach(ele => {
      stationsObj[ele.abbr] = ele;
    });

    // console.log(newRouteStations);
    // console.log(stationsObj);

    console.log(routesWithSchedules);
    routesWithSchedules.map((station, idx) => {
      let timeToNextStation = station["timeToNextStation"];
      let timeToDestination = station["timeToDestination"];
      let nextStationName = station["nextStation"];
      let previousStationName = station["previousStation"];
      let stationDepartures = { departures: [] };

      let nextStation = {};
      //   console.log(station);

      nextStation = obj[nextStationName];
      let previousStationTimetoNext;
      let previousStation;

      //   if (previousStationName) {
      //     previousStation = obj[previousStationName];
      //     previousStationTimetoNext = previousStation["timeToNextStation"];
      //   }

      let closestTrains = [];
      let closestTrain = {};
      let results = [];
      let destination;
      let trainDepartures = {};
      let firstStationWithTrains;

      if (station.trains) {
        //     console.log(idx);
        //     if (idx === 0) {
        //       firstStationWithTrains = 1;
        //     } else {
        //       firstStationWithTrains = idx;
        //     }
        // console.log(firstStationWithTrains);
        // let currentRoute2 =
        //   routesWithSchedules.slice(firstStationWithTrains, idx + 1) || [];
        // console.log(currentRoute2);
        // console.log(currentRoute2.slice(-1));
        // if (currentRoute2.slice(-1)[0])

        let collect = {};
        station.trains.map(currentTrain => {
          let threshold = previousStationTimetoNext;

          //   console.log(threshold);
          let currentDestinationName = currentTrain.abbreviation;
          //   console.log(currentDestinationName);
          let currentDestination = obj[currentDestinationName];
          let routeTotalTime = routesWithSchedules[0].timeToDestination;
          //   console.log(routeTotalTime);
          let firstStation = routesWithSchedules[0];
          let idx2 = routeStations.indexOf(currentDestinationName);
          let currentRoute = routesWithSchedules.slice(0, idx2 + 1);
          let collect = {};

          let estimates = currentTrain.estimate;
          console.log(estimates);
          const abc = estimates.filter(ele => {
            return (
              ele.hexcolor === routeHexColor && ele.direction === routeDirection
            );
          });
          currentDestination3 = currentDestinationName;
          stationDepartures["destination"] = currentDestinationName;
          stationDepartures["departures"] = estimates;
          stationDepartures["currentName"] = station.abbr;
          let newObj = merge({}, stationDepartures);
          trains.push(newObj);
          // trains.push({
          //   destination: currentDestinationName,
          //   departures: estimates
          // });

          // trains.concat(estimates);
          // estimates.map((estimate, idx2) => {
          //   console.log(estimate);

          //   if (
          //     (estimate.direction === "South" && routeNumber === "2") ||
          //     estimate.hexcolor === "#c463c5"
          //   ) {
          //     console.log(estimate, station, route, currentDestinationName);
          //     return;
          //   }
          //   trains.push(estimate);
          //   collect[currentDestinationName] = estimate;
          // });

          //   console.log(trains);
        });
      }
    });
    return (
      <LiveTrains
        trains={trains}
        routeStations={routeStations}
        // destination={currentDestination3}
        hexcolor={routeHexColor}
        direction={routeDirection}
        routeNumber={routeNumber}
        schedule={this.props.schedule}
        stationObj={stationsObj}
        waypoints={waypoints2}
      />
    );
  }

  render() {
    const allStations = this.props.allStations;
    const schedule = this.props.schedule;
    const route = this.props.route;
    // const routeNumber = route.number;
    // const routeDestination = routes[routeNumber].abbreviation;
    // console.log(routeDestination);
    // const waypoints3 = this.props.waypoints.waypoints || [];
    // const routeStations = route.stations;
    // const newRouteStations = routeStations.map(ele => {
    //   let station2 = allStations[ele];
    //   return station2;
    // });

    // console.log(waypoints3);

    //     console.log(newRouteStations);

    //     // let abc = newRouteStations.map(station => {
    //     //   //   let results = [];
    //     //   //   station["nextTrains"] = results;

    //     //   return station.etd.forEach(destination => {

    //     //     console.log(destination);
    //     //     if (routeDestination.includes(destination.abbreviation)) {
    //     //       return (station["next"] = destination);
    //     //     }
    //     //   });
    //     // });

    //     let stationEtds = newRouteStations.map(station => {
    //       let obj = {};
    //       obj["departures"] = station.etd;
    //       obj["name"] = station.name;
    //       return obj;
    //     });

    //     console.log(stationEtds);

    //     // let stationArivals = stationEtds.map(destination => {
    //     //   let results = [];
    //     //   //   console.log(destination.abbreviation);
    //     //   //   console.log(routeDestination);
    //     //   //   if (routeDestination.includes(destination.abbreviation)) {
    //     //   //     console.log("hi");
    //     //   //     results.push(destination);
    //     //   //   }

    //     //   return destination.departures;
    //     // });
    //     let arr = [];
    //     stationEtds.forEach(ele => {
    //       console.log(ele);
    //       let allDepartures = ele.departures;
    //       allDepartures.forEach(ele2 => {
    //         console.log(ele2);

    //         let dist = ele2.abbreviation;
    //         console.log(dist);
    //         console.log(routeDestination);
    //         let anc = [];

    //         console.log(routeDestination.includes(String(dist)));

    //         if (routeDestination.includes(String(dist))) {
    //           console.log("hi");
    //           anc.push(ele2);
    //           let trains = ele.trains || [];
    //           let newt = trains.concat(anc);
    //           console.log(newt);
    //           ele["trains"] = newt;
    //         }
    //       });

    //       arr.push(ele);
    //     });

    //     console.log(arr);

    // console.log(stationArivals);

    // let test = stationArivals.map(ele => {
    //   console.log(ele);
    //   return ele.map(ele2 => {
    //     let results = [];
    //     console.log(ele2);
    //     if (routeDestination.includes(ele2.abbreviation)) {
    //       results.push(ele2);
    //     }
    //     return results;
    //   });
    // });

    // console.log(test);

    // console.log(stationArivals);

    // newRouteStations.forEach(ele => {
    //   let station2 = allStations[ele.abbr];
    //   let station2Lat = parseFloat(station2.gtfs_latitude);
    //   let station2Long = parseFloat(station2.gtfs_longitude);
    //   let arr = [station2Lat, station2Long];
    //   ele["location"] = arr;
    // });

    // console.log(newRouteStations);
    // console.log(schedule);

    // newRouteStations.forEach((ele, idx) => {
    //   let scheduleData = schedule[idx];

    //   if (scheduleData && scheduleData.timeToNextStation) {
    //     ele["timeToNextStation"] = scheduleData.timeToNextStation;
    //     ele["nextStation"] = scheduleData.nextStationName;
    //   }
    // });

    // console.log(newRouteStations);
    if (route.length === 0) {
      return <p>loading</p>;
    } else {
      return (
        <div>
          {/* {route.stations.map(ele2 => {
          let station = allStations[ele2];
          return (
            <Station station={station} key={`marker-${station.abbr}`}></Station>
          );
        })} */}

          {this.renderStops()}
          {/* {waypoints3.map(ele => {
          return <Polyline positions={ele} />;
        })} */}
          {this.drawPolyline()}
          {this.renderTrains()}
        </div>
      );
    }
  }
}

export default Route;
