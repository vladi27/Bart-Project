import merge from "lodash/merge";
import {
  RECEIVE_ROUTES,
  RECEIVE_ROUTE_STATIONS,
  routes,
  RECEIVE_CURRENT_ETAS,
  CREATE_TRAINS,
  UPDATE_TRAINS,
  ADD_TRAINS,
  REMOVE_TRAINS,
  REMOVE_TRAIN
} from "../actions/station_actions";
import findIndex from "lodash/findIndex";
import find from "lodash/find";
import memoizeOne from "memoize-one";
import uniqBy from "lodash/uniq";

const uuidv4 = require("uuid/v4");
export const ROUTES = {
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
    abbreviation: ["WARM"],

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
const trainsReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case CREATE_TRAINS:
      const route = action.route;
      const currentEtas = action.etas;

      const newTrains = [];

      const routeDestination = ROUTES[route.number].abbreviation;
      const routeDirection = ROUTES[route.number].direction;
      const routeHexcolor = route.hexcolor;
      let routeStations = route.stations;
      let currentTrains = [];

      let sub = action.sub;

      //   if (action.sub === "update") {
      //     currentTrains = state[route.number].slice();

      //     if (currentTrains.length > 0) {
      //       const firstTrain = currentTrains[0];
      //       let firstMinutes = firstTrain.minutes;
      //       let firstTrainDestination = firstTrain.dest;
      //       let firstTrainDirection = firstTrain.direction;
      //       let firstHexcolor = firstTrain.hexcolor;
      //       let firstStationIdx = firstTrain.stationIdx;
      //       let currentStationDepartures =
      //         currentEtas[firstTrain.stationName].etd;
      //       let index = findIndex(currentStationDepartures, function(o) {
      //         return (
      //           o.abbreviation === firstTrainDestination &&
      //           o.hexcolor === firstHexcolor
      //         );
      //       });

      //       console.log(index);

      //       if (index > -1) {
      //         let currentMinutes =
      //           currentStationDepartures[index].estimate[0].minutes;
      //         let currentDirection =
      //           currentStationDepartures[index].estimate[0].direction;
      //         let currentHexcolor =
      //           currentStationDepartures[index].estimate[0].hexcolor;
      //         if (
      //           currentMinutes === "Leaving" ||
      //           Number(currentMinutes) <= Number(firstMinutes)
      //         ) {
      //           routeStations = route.stations.slice(0, firstStationIdx);
      //         } else if (
      //           firstMinutes === "Leaving" &&
      //           currentMinutes !== "Leaving"
      //         ) {
      //           routeStations = route.stations.slice(0, firstStationIdx + 1);
      //         }
      //       }
      //     }
      //   } else {

      // if (route.number === "2") {
      //   routeStations = route.stations.slice(0, -3);
      // } else if (route.number === "1") {
      //   routeStations = route.stations.slice(2, -2);
      // } else {
      //   routeStations = route.stations.slice(0, -1);
      // }

      console.log(routeStations);
      console.log(currentEtas);
      console.log(route);

      routeStations.map((station, idx) => {
        let stationName = station.stationName;
        let stationETAs = currentEtas[stationName];
        let prevStation = routeStations[idx - 1];
        if (stationETAs) {
          stationETAs.etd.map(departure => {
            let dest = departure.abbreviation;
            let hex = departure.hexcolor;

            if (routeDestination.includes(dest) && routeHexcolor === hex) {
              let closestDeparture = departure.estimate[0];
              let minutes = closestDeparture.minutes;
              let hexcolor = closestDeparture.hexcolor;
              let direction = closestDeparture.direction;

              {
                if (minutes === "Leaving" && idx !== routeStations.length - 1) {
                  let id = uuidv4();
                  let train = {
                    dest,
                    hexcolor,
                    direction: routeDirection,
                    minutes,
                    stationName,
                    lastTrain: false,
                    stationIdx: idx,
                    id,
                    pos: station.location,
                    initialPosition: true
                  };
                  return newTrains.push(train);
                } else if (minutes !== "Leaving" && prevStation) {
                  let prevName = prevStation.stationName;
                  console.log(prevName);
                  let prevETAs = currentEtas[prevName];
                  console.log(prevName, prevETAs);
                  let index;
                  if (prevETAs && prevETAs.etd) {
                    index = findIndex(prevETAs.etd, function(o) {
                      return o.abbreviation === dest && o.hexcolor === hexcolor;
                    });
                  }

                  console.log(index, stationName);

                  if (index > -1) {
                    let prevTrains = prevETAs.etd[index];
                    let prevMinutes = prevTrains.estimate[0].minutes;
                    let prevHexcolor = prevTrains.estimate[0].hexcolor;
                    let prevDirection = prevTrains.estimate[0].direction;

                    let diff = Number(minutes) - Number(prevMinutes);
                    console.log(diff, stationName, prevName, route.number);
                    let distance;

                    if (
                      departure.estimate[1] &&
                      prevTrains.estimate[0].minutes
                    ) {
                      distance =
                        Number(departure.estimate[1].minutes) -
                        Number(prevMinutes);
                    }
                    console.log(diff, distance, minutes);

                    if (
                      diff < 0 ||
                      (diff === 0 && Number(minutes) < distance)
                    ) {
                      let id2 = uuidv4();
                      let lastTrain = false;

                      if (idx === routeStations.length - 1) {
                        lastTrain = true;
                      }
                      let train = {
                        dest,
                        hexcolor,
                        direction: routeDirection,
                        minutes,
                        stationName,
                        lastTrain,
                        stationIdx: idx,
                        initialPosition: true,
                        id: id2,
                        pos: station.location
                      };
                      return newTrains.push(train);
                    }
                  }
                }
              }
            }
          });
        }
      });

      //   let newTrains2 = newTrains.concat(currentTrains);
      //   console.log(newTrains2);

      let trains2 = newTrains.sort((a, b) =>
        a.stationIdx > b.stationIdx ? 1 : -1
      );

      let trains3 = [];
      trains2.map((ele, idx) => {
        if (idx === 0) {
          ele["firstTrain"] = true;
        } else {
          ele["firstTrain"] = false;
        }
        trains3.push(ele);
      });

      const routeTrains = Object.assign({}, { [route.number]: trains3 });
      console.log(routeTrains);

      return merge({}, state, { [route.number]: trains3 });

    case REMOVE_TRAINS:
      const routeNum4 = action.routeNum;
      const allUpdatedTrains = [];
      const curTrains = state[routeNum4];
      // curTrains = Object.assign({}, allUpdatedTrains);

      // const newTrainsforRoute = { [routeNum4]: curTrains };

      return { ...state, [routeNum4]: allUpdatedTrains };
    case REMOVE_TRAIN:
      const routeNum5 = action.routeNum;
      const id = action.id;
      const curTrains2 = state[routeNum5].slice();
      const index = findIndex(currentTrains2, function(o) {
        return id === o.id;
      });

      curTrains2.splice(index, 1);

      return { ...state, [routeNum5]: curTrains2 };

      // curTrains = Object.assign({}, allUpdatedTrains);

      // const newTrainsforRoute = { [routeNum4]: curTrains };

      return { ...state, [routeNum4]: allUpdatedTrains };

    case ADD_TRAINS:
      const currentRoute = action.route;
      const currentRouteHexcolor = currentRoute.hexcolor;
      const currentEtas2 = action.etas;
      const currentRouteDirection = ROUTES[currentRoute.number].direction;
      const currentTrains2 = action.trains.slice();
      let currentStations = currentRoute.stations;
      const routeDestination2 = ROUTES[currentRoute.number].abbreviation;
      let currentStationsSlice = [];
      const newTrain5 = [];

      if (currentTrains2.length > 0) {
        const firstTrain = currentTrains2[0];
        let firstMinutes = firstTrain.minutes;
        let firstTrainDestination = firstTrain.dest;
        let firstTrainDirection = firstTrain.direction;
        let firstHexcolor = firstTrain.hexcolor;
        let firstStationIdx = firstTrain.stationIdx;
        let currentStationDepartures = currentEtas2[firstTrain.stationName].etd;
        let index = findIndex(currentStationDepartures, function(o) {
          return (
            o.abbreviation === firstTrainDestination &&
            o.hexcolor === firstHexcolor
          );
        });

        // if (currentRoute.number === "1") {
        //   currentStations = currentStationsSlice.slice(2);
        // }

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
            currentStationsSlice = currentStations.slice(0, firstStationIdx);
          } else if (
            firstMinutes === "Leaving" &&
            currentMinutes !== "Leaving"
          ) {
            currentStationsSlice = currentStations.slice(
              0,
              firstStationIdx + 1
            );
          }

          console.log(currentStationsSlice);

          if (currentStationsSlice.length > 0) {
            currentStationsSlice.map((station, idx4) => {
              console.log(station);
              let currents = currentEtas2[stationName2];
              let stationName2 = station.stationName;
              let departures = [];
              if (currents) {
                departures = currents["etd"];
              }
              let previousStation = currentStationsSlice[idx4 - 1];

              departures.map(departure => {
                let dest = departure.abbreviation;
                let hex = departure.hexcolor;
                if (
                  routeDestination2.includes(dest) &&
                  currentRouteHexcolor === hex
                ) {
                  let estimates = departure.estimate;
                  let minutes = estimates[0].minutes;
                  let direction = estimates[0].direction;
                  let hexcolor = estimates[0].hexcolor;
                  // let id = uuidv4();

                  let id = uuidv4();

                  if (minutes === "Leaving") {
                    let newTrain = {
                      dest,
                      hexcolor,
                      direction: currentRouteDirection,
                      minutes,
                      stationName: stationName2,
                      lastTrain: false,
                      stationIdx: idx4,
                      id,
                      pos: station.location,
                      initialPosition: true
                    };
                    return newTrain5.push(newTrain);
                  } else if (minutes !== "Leaving" && previousStation) {
                    let prevName = previousStation.stationName;
                    console.log(prevName);
                    let prevETAs = currentEtas2[prevName];
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
                        diff < 0 ||
                        (diff === 0 && Number(minutes) < distance)
                      ) {
                        let id2 = uuidv4();
                        let train = {
                          dest,
                          hexcolor,
                          direction: currentRouteDirection,
                          minutes,
                          stationName: stationName2,
                          lastTrain: false,
                          stationIdx: idx4,
                          id,
                          pos: station.location,
                          initialPosition: true
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

      if (newTrain5.length > 0) {
        let newcombined = newTrain5.concat(currentTrains2);
        console.log(newTrain5);
        console.log(newcombined);
        let newTrains3 = newcombined.sort((a, b) =>
          a.stationIdx > b.stationIdx ? 1 : -1
        );
        let newTrains4 = [];
        newTrains3.map((ele, idx) => {
          if (idx === 0) {
            ele["firstTrain"] = true;
            newTrains4.push(ele);
          } else if (idx !== 0) {
            ele["firstTrain"] = false;
            newTrains4.push(ele);
          }
        });

        const newTrains6 = uniqBy(newTrains4, "stationName");

        const updRoute = { [currentRoute.number]: newTrains6 };
        return merge({}, state, updRoute);
      }

      return merge({}, state);

    case UPDATE_TRAINS:
      const etas = action.etas;

      let allTrains = state[action.routeNum].slice();

      let stations = action.stations;
      // if (action.routeNum === "2") {
      //   stations = action.stations.slice(0, -3);
      // } else if (action.routeNum === "1") {
      //   stations = action.stations.slice(2, -2);
      // } else {
      //   stations = action.stations.slice(0, -1);
      // }
      let stationLength = stations.length - 1;
      const updatedTrains = [];

      allTrains.map((train, idx) => {
        console.log(train);
        let lastMinutes = train.minutes;
        let trainDestination = train.dest;
        let direction = train.direction;
        let hexcolor = train.hexcolor;
        let lastStation = train.stationName;
        let nextStationName;
        let nextStationEstimates;

        if (stations[train.stationIdx + 1]) {
          nextStationName = stations[train.stationIdx + 1].stationName;
          nextStationEstimates = etas[nextStationName].etd;
        }
        let currentStationEstimates = etas[lastStation].etd;
        let currentDepartures = find(currentStationEstimates, {
          abbreviation: trainDestination,
          hexcolor: hexcolor
        });
        console.log(currentDepartures);
        console.log(lastMinutes);

        if (currentDepartures) {
          let currentMinutes = currentDepartures.estimate[0].minutes;
          let currentDirection = currentDepartures.estimate[0].direction;
          let currentHexcolor = currentDepartures.estimate[0].hexcolor;
          if (lastMinutes === "Leaving" && currentMinutes !== "Leaving") {
            let nextDepartures = find(nextStationEstimates, {
              abbreviation: trainDestination,
              hexcolor: hexcolor
            });

            console.log(nextDepartures, train);

            let lastTrain = false;
            if (train.stationIdx + 1 === stationLength) {
              lastTrain = true;
            }
            let newObj = {
              stationName: nextStationName,
              stationIdx: train.stationIdx + 1,
              minutes: nextDepartures.estimate[0].minutes,
              //departures: nextStationEstimates[index3].estimate[0],
              lastTrain,
              pos: stations[train.stationIdx + 1].location,
              initialPosition: false
            };
            console.log(newObj);

            let updatedTrain = Object.assign({}, train, newObj);
            return updatedTrains.push(updatedTrain);
          } else if (
            (currentMinutes === "Leaving" &&
              (lastMinutes !== "Leaving") & !train.lastTrain) ||
            Number(currentMinutes) < Number(lastMinutes)
          ) {
            let updObj = {
              minutes: currentMinutes,
              initialPosition: false
              //departures: currentStationEstimates[index].estimate[0]
            };

            let updatedTrain = Object.assign({}, train, updObj);
            console.log(updatedTrain);
            return updatedTrains.push(updatedTrain);
          } else {
            let updatedTrain = Object.assign({}, train, {
              initialPosition: false
            });
            console.log(updatedTrain);
            return updatedTrains.push(updatedTrain);
          }
        } else if (
          currentDepartures === undefined &&
          lastMinutes === "Leaving"
        ) {
          let nextDepartures = find(nextStationEstimates, {
            abbreviation: trainDestination,
            hexcolor: hexcolor
          });

          if (nextDepartures) {
            let lastTrain = false;
            if (train.stationIdx + 1 === stationLength) {
              lastTrain = true;
            }
            let newObj = {
              stationName: nextStationName,
              stationIdx: train.stationIdx + 1,
              minutes: nextDepartures.estimate[0].minutes,
              pos: stations[train.stationIdx + 1].location,
              //departures: nextStationEstimates[index3].estimate[0],
              lastTrain,
              initialPosition: false
            };
            console.log(newObj);

            let updatedTrain = Object.assign({}, train, newObj);
            return updatedTrains.push(updatedTrain);
          }
        }
      });

      let sorted = updatedTrains.sort((a, b) =>
        a.stationIdx > b.stationIdx ? 1 : -1
      );
      let updatedSorted = [];
      console.log(allTrains, updatedTrains);

      sorted.map((ele, idx) => {
        if (idx === 0) {
          ele["firstTrain"] = true;
        } else {
          ele["firstTrain"] = false;
        }
        updatedSorted.push(ele);
      });
      console.log(allTrains, updatedSorted);
      let abc = uniqBy(updatedSorted, "id");
      console.log(abc);
      const newObj = Object.assign({}, { [action.routeNum]: abc });
      return merge({}, state, newObj);

    default:
      return state;
  }
};

export default trainsReducer;