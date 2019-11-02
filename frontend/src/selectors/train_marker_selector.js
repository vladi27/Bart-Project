import createCachedSelector from "re-reselect";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import * as geolib from "geolib";
import { getSchedules } from "../util/station_api_util";

const inRange = require("in-range");

const getMinutes = (state, props) => props.minutes;
const getTrain = (state, props) => props.train;
const getRouteStations = (state, props) =>
  state.routes[props.routeNumber].stations;
const getRouteSchedules = (state, props) =>
  state.schedules[props.routeNumber].obj;
const getWayPoints = (state, props) =>
  state.waypoints[Number(props.routeNumber) - 1];

const getStation = (state, props) => props.station;
const getSeconds = (state, props) => props.seconds;
const getId = (state, props) => props.id;
const getIndex = (state, props) => props.index;
const getInitialPosition = (state, props) => props.initialPosition;
const getInitialCoordinates = (state, props) => props.initialCoordinates;

const getRefs = (state, props) => props.references;
// const getRatio = (state, props) => props.ratio;
const getEtas = (state, props) => state.etas;
//const getLastLocation = (state, props) => props.lastLocation;
const getPosition = createCachedSelector(
  [
    getTrain,
    getMinutes,
    getRouteStations,
    getWayPoints,
    getRouteSchedules,
    getRefs,
    getStation,
    getId,
    getSeconds,
    getIndex,
    getInitialPosition,
    getInitialCoordinates
  ],
  (
    train,
    minutes,
    stations,
    waypoints,
    schedules,
    refers,
    stationName,
    id,
    seconds,
    trainIndex,
    initialPosition,
    initialCoordinates
  ) => {
    console.count();
    // console.log(lastLocation);
    console.log(id);
    console.log(refers);
    console.log(refers[id]);
    console.log(seconds, stationName);
    console.log(stationName, minutes);
    console.log(train);
    console.log(initialCoordinates);
    if (initialPosition && minutes !== "Leaving") {
      let slice = stations[trainIndex - 1].slice.slice();
      let geoSlice = stations[trainIndex - 1].geoSlice.slice();
      // let initialCoordinationates = trainitialCoordinationates;
      let distance = stations[trainIndex - 1].meterDistance;
      let timeStamp = performance.now();
      let destTimestamp = timeStamp + Number(minutes) * 60 * 1000;
      const speed = geolib.getSpeed(
        {
          latitude: Number(slice[0][0]),
          longitude: Number(slice[0][1]),
          time: timeStamp
        },
        {
          latitude: Number(slice[slice.length - 1][0]),
          longitude: Number(slice[slice.length - 1][1]),
          time: destTimestamp
        }
      );
      const metersPerWaypoint = distance / slice.length;
      console.log(stationName, speed);
      let index = indexOf(slice, initialCoordinates);
      console.log(slice, index, initialCoordinates);
      let currentSlice = slice.slice(index + 1);
      let geo = geoSlice.slice(index + 1);

      // if (currentSlice.length < 3) {
      //   currentSlice = slice.slice(Math.round(slice.length / 2));
      // }

      console.log(currentSlice, train);

      return { currentSlice, speed, metersPerWaypoint, distance, geo };
    } else if (initialPosition && minutes === "Leaving") {
      let currentSlice = stations[trainIndex].slice.slice();

      return currentSlice;
    }
    // if (!initialPosition && minutes === "Leaving") {
    //   let currentSlice = stations[trainIndex].slice.slice();
    //   let timeToStation = schedules[stationName].timeToNextStation;
    //   let interval = Math.round(
    //     (Number(timeToStation) * 60 * 1000) / (currentSlice.length - 1)
    //   );
    //   return { currentSlice, interval };
    // }

    // if (minutes === "Leaving") {
    //   let slice = stations[trainIndex].slice;
    //   let pos2 = slice[0];
    //   console.log(pos2);
    //   return pos2;
    // }

    // if (refers[id]) {
    //   //
    //   if (refers[id].current) {
    //     let pos = refers[id].current.leafletElement.options.position;

    //     let slice = stations[trainIndex - 1].slice;
    //     console.log(slice, stationName, minutes, pos);
    //     let index = indexOf(slice, pos);
    //     let pos2 = stations[train.stationIdx - 1]["slice"].shift();
    //     console.log(index);
    //     console.log(pos2);
    //     return pos2;
    //   }
    // }
    // if (minutes === "Leaving") {
    //   let stationSlice = stations[train.stationIdx].slice;
    //   // let stationCoord = geolib.findNearest(
    //   //   stationLocation,
    //   //   waypoints.waypoints
    //   // );
    //   // let coordIndex = indexOf(waypoints.waypoints, stationCoord);
    //   // let coord = waypoints.waypoints[coordIndex];
    //   console.count();
    //   let slice = stationSlice.shift();
    //   let nextStation = stations[train.stationIdx + 1].stationName;

    //   let timeToStation = schedules[stationName].timeToNextStation;
    //   let interval = (timeToStation * 60) / stationSlice.legth;
    //   let obj = {
    //     currentSlice: [slice],
    //     allMarkers: stationSlice,
    //     interval,
    //     seconds
    //   };
    //   let newTrain = Object.assign({}, train, obj);
    //   return newTrain;
    // } else if (stations[train.stationIdx - 1]) {
    //   let prevStation = stations[train.stationIdx - 1].stationName;
    //   if (prevStation) {
    //     console.log(prevStation);
    //     let timeToStation = schedules[prevStation].timeToNextStation;
    //     let ratio = Math.round(Number(minutes) / timeToStation);
    //     console.log(ratio);
    //     let stationSlice = stations[train.stationIdx - 1].slice;
    //     let newSlice = stationSlice;

    //     if (refers[id]) {
    //       let current = refers[id].current.leafletElement.options.position;
    //       let ind = indexOf(stationSlice, current);
    //       let slice1 = stationSlice.slice(ind + 1);
    //       let slice2 = stationSlice.slice(
    //         ind + 1,
    //         Math.round(stationSlice.length / 2) + 1
    //       );

    //       let slice3 = stationSlice.slice(
    //         ind + 1,
    //         Math.round(stationSlice.length - stationSlice.length / 4)
    //       );
    //       let slice4 = stationSlice.slice(
    //         ind + 1
    //         // Math.round(stationSlice.length - stationSlice.length / 4) + 1
    //       );
    //       let newRatio;

    //       if (inRange(ratio, { start: 0, end: 0.25 })) {
    //         newSlice = slice1;
    //         newRatio = 0;
    //       } else if (inRange(ratio, { start: 0.26, end: 0.5 })) {
    //         newSlice = slice2;
    //         newRatio = 0.25;
    //       } else if (inRange(ratio, { start: 0.51, end: 0.75 })) {
    //         newSlice = slice3;
    //         newRatio = 0.5;
    //       } else if (inRange(ratio, { start: 0.76, end: 1.5 })) {
    //         newSlice = slice4;
    //         newRatio = 0.75;
    //       }
    //     }

    //     // let index = indexOf(stations[train.stationIdx - 1].slice, lastLocation);
    //     // let newWay = stations[train.stationIdx - 1].slice.slice(index + 1);
    //     let interval = ((60 * Number(minutes)) / stationSlice.length) * 1000;

    //     let obj = {
    //       currentSlice: newSlice,
    //       seconds,
    //       // newRatio,

    //       interval
    //     };
    //     let newTrain = Object.assign({}, obj);
    //     return newTrain;
    //   }
    // }
  }
)((state, props) => props.id);

export default getPosition;
