import createCachedSelector from "re-reselect";

import findIndex from "lodash/findIndex";

import { createSelector } from "reselect";

export const ROUTES = {
  1: {
    hexcolor: "#ffff33",
    destination: "Millbrae",
    abbreviation: ["MLBR", "SFIA"],
    direction: "South",
    color: "Yellow",
    stationLength: 24
  },

  2: {
    hexcolor: "#ffff33",
    abbreviation: ["ANTC"],
    destination: "Antioch",
    direction: "North",
    color: "Yellow",
    stationLength: 25
  },

  3: {
    hexcolor: "#ff9933",
    abbreviation: ["RICH"],
    destination: "Richmond",
    direction: "North",
    color: "Orange",
    stationLength: 18
  },

  4: {
    hexcolor: "#ff9933",
    destination: ["Warm Springs"],
    abbreviation: ["WARM"],
    direction: "South",
    color: "Orange",
    stationLength: 18
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY"],
    stationLength: 19
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: ["Warm Springs"],
    abbreviation: ["WARM"],

    direction: "North",
    stationLength: 19
  },

  7: {
    color: "Red",
    hexcolor: "#ff0000",

    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY", "MLBR"],
    stations: 22
  },

  8: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "North",

    destination: "Richmond",
    abbreviation: ["RICH"],
    stations: 22
  }
};
const uuidv4 = require("uuid/v4");

const getTrains = (state, props) => props.trains[props.routeNumber];

const getEtas = state => state.etas;

const getWaypoints = (state, props) =>
  state.waypoints[Number(props.routeNumber) - 1];

const getRouteStations = (state, props) =>
  state.routes[props.routeNumber].stations;
const getRouteDestination = (state, props) =>
  ROUTES[props.routeNumber].abbreviation;
const getRoute = (state, props) => state.routes[props.routeNumber];

const addNewTrains = createCachedSelector(
  [getTrains, getEtas, getRoute],
  (trains, etas, route) => {
    const stations = route.stations;
    const routeDestinations = ROUTES[route.number].abbreviation;
    const routeDirection = ROUTES[route.number].direction;
    let currentStationsSlice = [];
    const currentRouteHexcolor = route.hexcolor;
    const newTrain5 = [];
    if (trains.length > 0) {
      const firstTrain = trains[0];
      let firstMinutes = firstTrain.minutes;
      let firstTrainDestination = firstTrain.dest;
      let firstTrainDirection = firstTrain.direction;
      let firstHexcolor = firstTrain.hexcolor;
      let firstStationIdx = firstTrain.stationIdx;
      let currentStationDepartures = etas[firstTrain.stationName].etd;
      let index = findIndex(currentStationDepartures, function(o) {
        return (
          o.abbreviation === firstTrainDestination &&
          o.hexcolor === firstHexcolor
        );
      });

      console.log(index);

      if (index > -1) {
        let currentMinutes =
          currentStationDepartures[index].estimate[0].minutes;
        let currentDirection =
          currentStationDepartures[index].estimate[0].direction;
        let currentHexcolor =
          currentStationDepartures[index].estimate[0].hexcolor;
        if (
          currentMinutes === "Leaving" ||
          Number(currentMinutes) <= Number(firstMinutes)
        ) {
          currentStationsSlice = stations.slice(0, firstStationIdx);
        } else if (firstMinutes === "Leaving" && currentMinutes !== "Leaving") {
          currentStationsSlice = stations.slice(0, firstStationIdx + 1);
        }

        console.log(currentStationsSlice);

        if (currentStationsSlice.length > 0) {
          currentStationsSlice.map((station, idx4) => {
            console.log(station);
            let stationName2 = station.stationName;
            let departures = etas[stationName2].etd;
            let previousStation = currentStationsSlice[idx4 - 1];

            departures.map(departure => {
              let dest = departure.abbreviation;
              let hex = departure.hexcolor;

              if (
                routeDestinations.includes(dest) &&
                currentRouteHexcolor === hex
              ) {
                let estimates = departure.estimate;
                let minutes = estimates[0].minutes;
                let direction = estimates[0].direction;
                let hexcolor = estimates[0].hexcolor;
                // let id = uuidv4();

                let id = uuidv4();

                if (minutes === "Leaving" && direction === routeDirection) {
                  let newTrain = {
                    dest,
                    minutes,
                    direction,
                    hexcolor,
                    id,
                    stationIdx: idx4,
                    lastTrain: false,
                    stationName: stationName2,
                    pos: station.location
                  };
                  return newTrain5.push(newTrain);
                } else if (previousStation) {
                  let prevName = previousStation.stationName;
                  console.log(prevName);
                  let prevETAs = etas[prevName];
                  console.log(prevName, prevETAs);
                  let index2 = findIndex(prevETAs.etd, function(o) {
                    return o.abbreviation === dest && o.hexcolor === hexcolor;
                  });

                  if (index2 > -1) {
                    let prevTrains = prevETAs.etd[index2];
                    let prevMinutes = prevTrains.estimate[0].minutes;
                    let prevHexcolor = prevTrains.estimate[0].hexcolor;
                    let prevDirection = prevTrains.estimate[0].direction;

                    let diff = Number(minutes) - Number(prevMinutes);
                    console.log(diff);
                    let distance;
                    if (
                      departure.estimate[1] &&
                      prevTrains.estimate[0].minutes
                    ) {
                      distance =
                        Number(departure.estimate[1].minutes) -
                        Number(prevMinutes);
                    }

                    if (
                      diff < 0 &&
                      prevDirection === routeDirection &&
                      direction === routeDirection
                      // ||
                      // (diff === 0 && Number(minutes) < distance)
                    ) {
                      let id2 = uuidv4();
                      let train = {
                        dest,
                        hexcolor,
                        direction,
                        minutes,
                        stationName: stationName2,
                        lastTrain: false,
                        stationIdx: idx4,
                        id: id2,
                        pos: station.location
                      };
                      return newTrain5.push(train);
                    }
                  }
                }
              }
            });
          });
        }
      }
    }
    console.log(newTrain5);
    return newTrain5;
  }
)(
  /*
   * Re-reselect resolver function.
   * Cache/call a new selector for each different "listId"
   */
  (state, props) => props.routeNumber + "id"
);

export default addNewTrains;
