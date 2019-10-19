import { createSelector } from "reselect";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import * as geolib from "geolib";
import createCachedSelector from "re-reselect";
import uniqBy from "lodash/uniq";

const inRange = require("in-range");

const getTrains = (state, props) => state.trains[props.routeNumber];

const getEtas = state => state.etas;

const getWaypoints = (state, props) =>
  state.waypoints[Number(props.routeNumber) - 1];

const getRouteStations = (state, props) =>
  state.routes[props.routeNumber].stations;
const getRouteSchedules = (state, props) =>
  state.schedules[props.routeNumber].obj;

const updateCurrentTrains = createCachedSelector(
  [getTrains, getEtas, getWaypoints, getRouteStations, getRouteSchedules],
  (trains, etas, waypoints, stations, schedules) => {
    console.log(trains);
    if (trains) {
      const newT = trains.map(train => {
        let minutes = train.minutes;

        if (train.initialPosition) {
          if (minutes === "Leaving") {
            let stationSlice = stations[train.stationIdx].slice;
            let timeToStation;
            if (schedules[train.station]) {
              timeToStation = schedules[train.station].timeToNextStation;
            } else {
              timeToStation = 5;
            }
            let diff = stationSlice.length - Number(timeToStation) * 60;
            console.log(diff);
            if (diff > 0) {
              let ratio = Math.round(
                (stationSlice.length / Number(timeToStation)) * 60
              );

              if (ratio > 1) {
                let selectIndex = ratio;
                let delay = null;

                let obj = { selectIndex, delay, allMarkers: stationSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              } else {
                let selectIndex = null;
                let delay = null;

                let obj = { selectIndex, delay, allMarkers: stationSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              }
            } else if (diff < 0) {
              let ratio = Math.round(
                (Number(timeToStation) * 60) / stationSlice.length
              );

              if (ratio > 1) {
                let selectIndex = null;
                let delay = ratio;

                let obj = { selectIndex, delay, allMarkers: stationSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              } else {
                let selectIndex = null;
                let delay = null;

                let obj = { selectIndex, delay, allMarkers: stationSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              }
            } else {
              let selectIndex = null;
              let delay = null;

              let obj = { selectIndex, delay, allMarkers: stationSlice };
              let newTrain = Object.assign({}, train, obj);
              return newTrain;
            }
          } else if (minutes !== "Leaving") {
            let prevStation = stations[train.stationIdx - 1].stationName;

            let timeToStation = schedules[prevStation].timeToNextStation;
            let ratio = Math.round(Number(minutes) / timeToStation);
            let stationSlice = stations[train.stationIdx - 1].slice;
            let newSlice;
            let newRatio;
            let slice1 = stationSlice.slice(1);
            let slice2 = stationSlice.slice(
              Math.round(stationSlice.length / 4)
            );

            let slice3 = stationSlice.slice(
              Math.round(stationSlice.length / 2)
            );
            let slice4 = stationSlice.slice(
              Math.round(stationSlice.length - stationSlice.length / 4) + 1
            );

            if (inRange(ratio, { start: 0, end: 0.25 })) {
              newSlice = slice1;
              newRatio = 0;
            } else if (inRange(ratio, { start: 0.26, end: 0.5 })) {
              newSlice = slice2;
              newRatio = 0.25;
            } else if (inRange(ratio, { start: 0.51, end: 0.75 })) {
              newSlice = slice3;
              newRatio = 0.5;
            } else if (inRange(ratio, { start: 0.76, end: 1.5 })) {
              newSlice = slice4;
              newRatio = 0.75;
            }

            let diff2 = newSlice.length - Number(minutes) * 60;
            if (diff2 > 0) {
              let ratio2 = Math.round(
                (newSlice.length / Number(timeToStation)) * 60
              );

              if (ratio2 > 1) {
                let selectIndex = ratio2;
                let delay = null;

                let obj = { selectIndex, delay, allMarkers: newSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              } else {
                let selectIndex = null;
                let delay = null;

                let obj = { selectIndex, delay };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              }
            } else if (diff2 < 0) {
              let ratio2 = Math.round(
                (Number(timeToStation) * 60) / newSlice.length
              );

              if (ratio2 > 1) {
                let selectIndex = null;
                let delay = ratio2;

                let obj = { selectIndex, delay, allMarkers: newSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              } else {
                let selectIndex = null;
                let delay = null;

                let obj = { selectIndex, delay, allMarkers: newSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              }
            } else {
              let selectIndex = null;
              let delay = null;

              let obj = { selectIndex, delay, allMarkers: newSlice };
              let newTrain = Object.assign({}, train, obj);
              return newTrain;
            }
          }
        } else if (!train.initialPosition) {
          if (minutes === "Leaving") {
            let stationSlice = stations[train.stationIdx].slice;
            let timeToStation;
            if (schedules[train.station]) {
              timeToStation = schedules[train.station].timeToNextStation;
            } else {
              timeToStation = 5;
            }
            let diff = stationSlice.length - Number(timeToStation) * 60;
            console.log(diff, train.station, stationSlice);
            if (diff > 0) {
              let ratio = Math.round(
                (stationSlice.length / Number(timeToStation)) * 60
              );

              if (ratio > 1) {
                let selectIndex = ratio;
                let delay = null;

                let obj = { selectIndex, delay, allMarkers: stationSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              } else {
                let selectIndex = null;
                let delay = null;

                let obj = { selectIndex, delay, allMarkers: stationSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              }
            } else if (diff < 0) {
              let ratio2 = Math.round(
                (Number(timeToStation) * 60) / stationSlice.length
              );

              if (ratio2 > 1) {
                let selectIndex = null;
                let delay = ratio2;

                let obj = { selectIndex, delay, allMarkers: stationSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              } else {
                let selectIndex = null;
                let delay = null;

                let obj = { selectIndex, delay, allMarkers: stationSlice };
                let newTrain = Object.assign({}, train, obj);
                return newTrain;
              }
            } else {
              let selectIndex = null;
              let delay = null;

              let obj = { selectIndex, delay, allMarkers: stationSlice };
              let newTrain = Object.assign({}, train, obj);
              return newTrain;
            }
          } else {
            // let selectIndex = null;
            // let delay = null;

            let newTrain = Object.assign({}, train);
            return newTrain;
          }
        }

        // if (minutes === "Leaving") {
        //   let stationLocation = stations[train.stationIdx].location;
        //   let stationCoord = geolib.findNearest(
        //     stationLocation,
        //     waypoints.waypoints
        //   );
        //   let coordIndex = indexOf(waypoints.waypoints, stationCoord);
        //   let coord = waypoints.waypoints[coordIndex];
        //   let slice = [coord, coord];
        //   let obj = {
        //     currentSlice: slice,
        //     ratio: 1
        //   };
        //   let newTrain = Object.assign({}, train, obj);
        //   return newTrain;
        // } else if (minutes !== "Leaving") {
        //   let trainDest = train.dest;
        //   let hexcolor = train.hexcolor;
        //   let direction = train.direction;

        //   let stationName = train.stationName;
        //   let currentDepartures = etas[stationName].etd;
        //   let index = findIndex(currentDepartures, function(o) {
        //     return o.abbreviation === trainDest && hexcolor === o.hexcolor;
        //   });

        //   if (index > -1) {
        //     let curTrains = currentDepartures[index];
        //     let curMinutes = curTrains.estimate[1].minutes;
        //     let curHexcolor = curTrains.estimate[1].hexcolor;
        //     let curDirection = curTrains.estimate[1].direction;

        //     {
        //       let prevStation = stations[train.stationIdx - 1].stationName;
        //       let prevLocation = stations[train.stationIdx - 1].location;
        //       let prevDepartures;
        //       if (prevStation) {
        //         prevDepartures = etas[prevStation].etd;
        //         let index2 = findIndex(prevDepartures, function(o) {
        //           return (
        //             o.abbreviation === trainDest && hexcolor === o.hexcolor
        //           );
        //         });
        //         console.log(index2);

        //         let distance;
        //         let prevTrains = prevDepartures[index2];

        //         {
        //           if (
        //             index2 > -1 &&
        //             prevTrains.estimate[0] &&
        //             prevTrains.estimate[0].minutes === "Leaving"
        //           ) {
        //             distance = curTrains.estimate[0].minutes;
        //           } else if (index2 > -1 && prevTrains.estimate[0]) {
        //             let prevMinutes = prevTrains.estimate[0].minutes;
        //             let prevHexcolor = prevTrains.estimate[0].hexcolor;
        //             let prevDirection = prevTrains.estimate[0].direction;
        //             distance = Number(curMinutes) - Number(prevMinutes);
        //           }
        //           console.log(distance, train);
        //           let ratio = (distance - Number(minutes)) / distance;
        //           if (ratio < 0) {
        //             console.log(distance, train, curTrains.estimate[1].minutes);
        //             ratio = 0;
        //           }
        //           if (ratio > 1) {
        //             ratio = 0.75;
        //           }
        //           console.log(ratio, train);

        //           let stationLocation = stations[train.stationIdx].location;
        //           let stationCoord = geolib.findNearest(
        //             stationLocation,
        //             waypoints.waypoints
        //           );

        //           let prevCoord = geolib.findNearest(
        //             prevLocation,
        //             waypoints.waypoints
        //           );

        //           let coordIndex = indexOf(waypoints.waypoints, stationCoord);
        //           let coordIndex2 = indexOf(waypoints.waypoints, prevCoord);

        //           let stationSlice = waypoints.waypoints.slice(
        //             coordIndex2,
        //             coordIndex
        //           );
        //           console.log(stationSlice);
        //           let newSlice;
        //           let slice1 = stationSlice.slice(0);
        //           let slice2 = stationSlice.slice(
        //             Math.round(stationSlice.length / 4) + 1
        //           );

        //           let slice3 = stationSlice.slice(
        //             Math.round(stationSlice.length / 2) + 1
        //           );
        //           let slice4 = stationSlice.slice(
        //             Math.round(stationSlice.length - stationSlice.length / 4) +
        //               1
        //           );

        //           let newRatio;

        //           if (inRange(ratio, { start: 0, end: 0.25 })) {
        //             newSlice = slice1;
        //             newRatio = 0;
        //           } else if (inRange(ratio, { start: 0.26, end: 0.5 })) {
        //             newSlice = slice2;
        //             newRatio = 0.25;
        //           } else if (inRange(ratio, { start: 0.51, end: 0.75 })) {
        //             newSlice = slice3;
        //             newRatio = 0.5;
        //           } else if (inRange(ratio, { start: 0.76, end: 0.99 })) {
        //             newSlice = slice4;
        //             newRatio = 0.75;
        //           }
        //           let obj = {
        //             currentSlice: newSlice,
        //             ratio: newRatio
        //           };
        //           let newTrain = Object.assign({}, train, obj);
        //           return newTrain;
        //         }
        //       }
        //     }
        //   }
        // }
      });
      return newT;
    }
  }
)((state, props) => props.routeNumber);

export default updateCurrentTrains;
