import { connect } from "react-redux";
import Route from "./route";
import * as geolib from "geolib";
import {
  fetchStations,
  fetchRouteInfo,
  fetchInitialStationDataSouth,
  fetchInitialStationDataNorth,
  receiveWayPoints,
  fetchRoutes,
  getCurrentEtas,
  fetchRouteStations,
  fetchRouteSchedules,
  fetchStationDepartures,
  createTrains,
  updateTrains
} from "../../actions/station_actions";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
const uuidv4 = require("uuid/v4");

const ROUTES = {
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

const msp = (state, ownProps) => {
  const route = state.routes[ownProps.routeNumber];
  const routeID = route.routeID;

  const etas = state.etas;
  const waypoints = state.waypoints[Number(ownProps.routeNumber) - 1];
  console.log(waypoints);
  const allStations = state.stations;
  const routeHexcolor = route.hexcolor;
  const routeDirection = ROUTES[ownProps.routeNumber].direction;
  let routeStations = route.stations;
  const trains = route.trains;
  console.log(trains);
  // const firstStation = routeStations[0].stationName;
  // console.count();
  // const trains = [];
  // let routeStationNames = routeStations.map(station => {
  //   return station.stationName;
  // });
  // console.log(routeStationNames);
  // let allStat;

  // if (route.number === "2") {
  //   routeStations = routeStations.slice(0, -2);
  //   routeStationNames = routeStationNames.slice(0, -2);
  // }

  // console.log(routeStations, routeStationNames);

  // routeStations.map((station, idx) => {
  //   let stationName = station.stationName;
  //   let departures = station.trains;
  //   let previousStation = routeStations[idx - 1];
  //   let prevName;
  //   if (previousStation) {
  //     prevName = previousStation.stationName;
  //   }

  //   departures.map(departure => {
  //     let destination = departure.abbreviation;
  //     let destinationIDX = routeStationNames.length - 1;
  //     console.log(destination);
  //     if (previousStation && previousStation.trains) {
  //       let index = findIndex(previousStation.trains, function(o) {
  //         return o.abbreviation === destination;
  //       });
  //       let previousStationDepartures;
  //       if (index > -1) {
  //         previousStationDepartures = previousStation.trains[index];
  //       }
  //       let estimates = departure.estimate;
  //       let minutes = estimates[0].minutes;
  //       let direction = estimates[0].direction;
  //       let hexcolor = estimates[0].hexcolor;
  //       // let id = uuidv4();

  //       let id = stationName + routeID + estimates[0].platform;

  //       console.log(id);
  //       console.log(minutes, direction, hexcolor);
  //       if (
  //         minutes === "Leaving" &&
  //         direction === routeDirection &&
  //         hexcolor === routeHexcolor
  //       ) {
  //         console.log("leaving", stationName);
  //         let station2 = allStations[stationName];
  //         let station2Lat = parseFloat(station2.gtfs_latitude);
  //         let station2Long = parseFloat(station2.gtfs_longitude);
  //         let arr2 = [station2Lat, station2Long];
  //         let nextStation;

  //         if (idx + 1 !== undefined) {
  //           nextStation = routeStations[idx + 1];
  //         }
  //         let firstTrain = false;
  //         if (idx === 0 || (idx === 1 && stationName === "SFIA")) {
  //           firstTrain = true;
  //         }
  //         let lastTrain = false;
  //         if (destinationIDX - idx === 1) {
  //           lastTrain = true;
  //         }
  //         //   let id2 = nextStation.stationName + routeID + estimates[0].platform;
  //         let train = {
  //           slice: arr2,
  //           id: id,
  //           station: stationName,
  //           leaving: true,
  //           id2: id,
  //           firstTrain,
  //           lastTrain
  //         };
  //         trains.push(train);
  //       } else {
  //         let prevStationEstimate;
  //         if (previousStationDepartures) {
  //           prevStationEstimate = previousStationDepartures.estimate[0];
  //         }
  //         let prevStationMinutes;
  //         let prevStationDirection;
  //         let prevStationHexcolor;
  //         if (prevStationEstimate) {
  //           prevStationMinutes = Number(prevStationEstimate.minutes);
  //           prevStationDirection = prevStationEstimate.direction;
  //           prevStationHexcolor = prevStationEstimate.hexcolor;
  //         }
  //         console.log(
  //           stationName,
  //           prevName,
  //           minutes,
  //           prevStationMinutes,
  //           prevStationDirection,
  //           prevStationHexcolor
  //         );

  //         let diff = Number(minutes) - prevStationMinutes;
  //         console.log(diff);
  //         if (
  //           diff < 0 &&
  //           direction === prevStationDirection &&
  //           hexcolor === prevStationHexcolor
  //         ) {
  //           console.log("in-between");
  //           console.log(stationName, prevStationMinutes, diff);
  //           let station2 = allStations[stationName];
  //           let station2Lat = station2.gtfs_latitude;
  //           let station2Long = station2.gtfs_longitude;
  //           let arr2 = [station2Lat, station2Long];
  //           let station3 = allStations[prevName];
  //           let timeToStation = schedules[prevName].timeToNextStation;
  //           let station3Lat = station3.gtfs_latitude;
  //           let station3Long = station3.gtfs_longitude;
  //           let arr3 = [station3Lat, station3Long];
  //           let nearestPoint = geolib.findNearest(arr2, waypoints.waypoints);
  //           let nearestPoint2 = geolib.findNearest(arr3, waypoints.waypoints);
  //           console.log(nearestPoint, nearestPoint2);

  //           let stationIdx = indexOf(waypoints["waypoints"], nearestPoint);
  //           //   let stationIdx2 = indexOf(waypoints["waypoints"], nearestPoint2);
  //           let stationIdx3 = indexOf(waypoints["waypoints"], nearestPoint2);
  //           let waypointsSlice = waypoints.waypoints.slice(
  //             stationIdx3,
  //             stationIdx
  //           );
  //           console.log(stationIdx, stationIdx3, waypointsSlice);
  //           let distanceToCover = geolib.getPathLength(waypointsSlice);

  //           console.log(distanceToCover, stationName);
  //           let metersBetweenWayPoints = Math.round(
  //             distanceToCover / waypointsSlice.length
  //           );

  //           const bartSpeed = 10;
  //           let timeInSeconds = Number(minutes) * 60;
  //           let leftToCoverMeters = timeInSeconds * bartSpeed;
  //           console.log(leftToCoverMeters);
  //           let distanceCovered = distanceToCover - leftToCoverMeters;
  //           let currentLocationIdx;

  //           if (distanceCovered <= 0) {
  //             currentLocationIdx = waypointsSlice.length - 1;
  //           } else {
  //             currentLocationIdx = Math.round(
  //               distanceCovered / metersBetweenWayPoints
  //             );
  //           }
  //           let currentLocation = waypointsSlice[currentLocationIdx];
  //           let animationTime = 60;
  //           let distanceToCoverForAnimation = 600;
  //           let slice2 = waypointsSlice.slice(currentLocationIdx, stationIdx);
  //           let abcd = Math.round(600 / slice2.length);
  //           // let distanceToCover2 = geolib.getPathLength(waypoints.slice2);
  //           // let metersBetween2 = distanceToCover2 / slice2.length;
  //           let ratio2 = 60 / timeInSeconds;
  //           let path = leftToCoverMeters / 600;
  //           let slice3;

  //           if (path <= 1) {
  //             slice3 = slice2.slice(-10);
  //           } else {
  //             let newPath = Math.round(slice2.length / path);
  //             if (newPath >= 10) {
  //               slice3 = slice2.slice(0, newPath).slice(0, 11);
  //             } else {
  //               slice3 = slice2.slice(0, newPath);
  //             }
  //           }

  //           // let nums = path / metersBetween;

  //           // if (ratio2 === 1) {
  //           //     slice3 = slice2;
  //           // }
  //           // else if (ratio > 0.5) {
  //           //       let sliceCenter7 = geolib.getCenter(slice2);
  //           //   let nearestPoint5 = geolib.findNearest(sliceCenter2, slice4);
  //           //   let stationIdx5 = indexOf(slice4, nearestPoint5);
  //           //   nearestPoint5 = slice4[stationIdx5 + 10];
  //           // }

  //           console.log(
  //             timeInSeconds,
  //             leftToCoverMeters,
  //             distanceToCover,
  //             distanceCovered,
  //             currentLocationIdx,
  //             waypointsSlice.length,
  //             currentLocation,
  //             stationName,
  //             destination,
  //             routeID,
  //             slice3
  //           );

  //           let firstTrain = false;
  //           if (idx === 1 || (idx == 2 && prevName === "SFIA")) {
  //             firstTrain = true;
  //           }
  //           let lastTrain = false;
  //           if (destinationIDX - idx === 1) {
  //             lastTrain = true;
  //           }

  //           let train = {
  //             location: currentLocation,
  //             id: id,
  //             slice: slice3,
  //             station: stationName,
  //             lastTrain,
  //             firstTrain
  //           };
  //           trains.push(train);

  //           // let ratio = Number(minutes) / Number(timeToStation);
  //           // console.log(ratio);
  //           // // waypointsSlice = waypointsSlice.slice(
  //           // //   Math.round(waypointsSlice.length * ratio)
  //           // // );
  //           // let sliceCenter = geolib.getCenter(waypointsSlice);

  //           // let nearestPoint4 = geolib.findNearest(sliceCenter, waypointsSlice);
  //           // let stationIdx4 = indexOf(waypointsSlice, nearestPoint4);
  //           // nearestPoint4 = waypointsSlice[stationIdx4];
  //           // console.log(nearestPoint4);
  //           // console.log(stationIdx4);

  //           // if (ratio === 0.5) {
  //           //   let train = {
  //           //     location: nearestPoint4,
  //           //     id: id,
  //           //     station: stationName
  //           //   };

  //           //   console.log(train);
  //           //   trains.push(train);
  //           // } else if (ratio < 0.5) {
  //           //   let slice4 = waypointsSlice.slice(0, stationIdx4);
  //           //   let sliceCenter2 = geolib.getCenter(slice4);
  //           //   let nearestPoint5 = geolib.findNearest(sliceCenter2, slice4);
  //           //   let stationIdx5 = indexOf(slice4, nearestPoint5);
  //           //   nearestPoint5 = slice4[stationIdx5 + 10];
  //           //   let train = {
  //           //     location: nearestPoint5,
  //           //     id: id,
  //           //     station: stationName
  //           //   };
  //           //   console.log(train);
  //           //   trains.push(train);
  //           // } else {
  //           //   let slice5 = waypointsSlice.slice(
  //           //     stationIdx4,
  //           //     waypointsSlice.length
  //           //   );
  //           //   let sliceCenter3 = geolib.getCenter(slice5);
  //           //   let nearestPoint6 = geolib.findNearest(sliceCenter3, slice5);
  //           //   let stationIdx6 = indexOf(slice5, nearestPoint6);
  //           //   nearestPoint6 = slice5[stationIdx6];
  //           //   let train = {
  //           //     location: nearestPoint6,
  //           //     id: id,
  //           //     station: stationName
  //           //   };
  //           //   console.log(train);
  //           //   trains.push(train);
  //           // }
  //         }
  //       }

  //       // console.log(previousStationDepartures);
  //       // estimates.map((estimate, idx2) => {
  //       //   let minutes = estimate.minutes;
  //       //   console.log(minutes);
  //       //   if (minutes === "Leaving") {
  //       //     let station2 = allStations[stationName];
  //       //     let station2Lat = parseFloat(station2.gtfs_latitude);
  //       //     let station2Long = parseFloat(station2.gtfs_longitude);
  //       //     let arr2 = [station2Lat, station2Long];
  //       //     return trains.push(arr2);
  //       //   } else {
  //       //     let prevStationEstimate;
  //       //     if (previousStationDepartures) {
  //       //       prevStationEstimate = previousStationDepartures.estimate[idx2];
  //       //     }
  //       //     let prevStationMinutes;
  //       //     if (prevStationEstimate) {
  //       //       prevStationMinutes = Number(prevStationEstimate.minutes);
  //       //     }
  //       //     console.log(stationName, prevName, minutes, prevStationMinutes);

  //       //     let diff = Number(minutes) - prevStationMinutes;
  //       //     console.log(diff);
  //       //     if (diff < 0) {
  //       //       console.log("in-between");
  //       //       console.log(stationName, prevStationMinutes, diff);
  //       //     }
  //       //   }
  //       // });
  //     }
  //   });
  // });

  // console.log(routeStations);

  // console.log(route);
  // console.log(trains);
  // console.count();

  return {
    trains: trains,
    route: state.routes[ownProps.routeNumber],
    routeID: routeID,
    allStations,
    etas: state.etas,
    waypoints
  };
};

const mdp = dispatch => {
  return {
    getCurrentEtas: () => dispatch(getCurrentEtas()),
    createTrains: route => dispatch(createTrains(route)),
    updateTrains: route => dispatch(updateTrains(route))
  };
};

export default connect(
  msp,
  mdp
)(Route);
