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

const createInitialPosition = createCachedSelector(
  [getTrains, getEtas, getWaypoints, getRouteStations, getRouteSchedules],
  (trains, etas, waypoints, stations, schedules) => {
    console.log(trains);
    if (trains) {
      const results = [];
      const newT = trains.map(train => {
        let minutes = train.minutes;

        if (train.initialPosition) {
          if (minutes === "Leaving" && !train.lastTrain) {
            let stationSlice = stations[train.stationIdx].slice.slice();
            let initialCoordinates = stationSlice.shift();
            let initialSlice = stationSlice;
            console.log(train.stationName, schedules[train.stationName]);
            console.log(train.stationName, initialSlice);

            let timeToStation = schedules[train.stationName].timeToNextStation;
            let interval = Math.round(
              (Number(timeToStation) * 60 * 1000) / stationSlice.length
            );
            let obj = {
              initialCoordinates,
              interval,
              initialSlice
            };
            let newTrain = Object.assign({}, train, obj);
            console.log(newTrain);
            results.push(newTrain);
          } else if (minutes !== "Leaving") {
            let prevStation = stations[train.stationIdx - 1].stationName;

            let timeToStation = schedules[prevStation].timeToNextStation;
            console.log(timeToStation, train);
            let ratio = Number(minutes) / timeToStation;

            if (ratio < 0) {
              ratio = 1;
            }
            console.log(ratio, train);
            let stationSlice = stations[train.stationIdx - 1].slice.slice();
            let newSlice = [];
            let newRatio;
            let slice1 = stationSlice.slice(1);
            let slice2 = stationSlice.slice(
              Math.floor(stationSlice.length * 0.25)
            );

            let slice3 = stationSlice.slice(
              Math.round(stationSlice.length / 2)
            );
            let slice4 = stationSlice.slice(
              Math.floor(stationSlice.length * 0.75)
            );

            if (inRange(ratio, { start: 0, end: 0.25 })) {
              newSlice = slice4;
              newRatio = 0;
            } else if (inRange(ratio, { start: 0.26, end: 0.49 })) {
              newSlice = slice3;
              newRatio = 0.25;
            } else if (inRange(ratio, { start: 0.5, end: 0.74 })) {
              newSlice = slice2;
              newRatio = 0.5;
            } else if (inRange(ratio, { start: 0.75, end: 1.5 })) {
              newSlice = slice1;
              newRatio = 0.75;
            } else {
              newSlice = slice3;
            }

            if (newSlice.length > 200) {
              newSlice = stationSlice.slice(-200);
            } else if (newSlice.length < 3) {
              newSlice = stationSlice.slice(-5);
            }
            console.log(newSlice, train);

            let len = newSlice.length - 1;
            let interval = Math.round((Number(minutes) * 60 * 1000) / len);
            console.log(train, newSlice);
            let initialCoordinates = newSlice.shift();
            let initialSlice = newSlice;
            let obj = Object.assign(
              {},
              {
                initialCoordinates,
                interval,
                initialSlice
              }
            );

            let newTrain = Object.assign({}, train, obj);
            console.log(newTrain);
            results.push(newTrain);
          }
        } else {
          results.push(train);
        }
      });
      return results;
    }
  }
)((state, props) => props.routeNumber);

export default createInitialPosition;