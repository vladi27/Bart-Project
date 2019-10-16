import merge from "lodash/merge";
import {
  RECEIVE_ROUTES,
  RECEIVE_ROUTE_STATIONS,
  routes,
  RECEIVE_CURRENT_ETAS,
  CREATE_TRAINS,
  UPDATE_TRAINS,
  ADD_TRAINS,
  SAVE_TRAINS
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
      let routeStations = [];
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

      if (route.number === "2") {
        routeStations = route.stations.slice(0, -3);
      } else {
        routeStations = route.stations.slice(0, -1);
      }

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

              if (direction === routeDirection) {
                if (minutes === "Leaving" && idx !== routeStations.length - 1) {
                  let id = uuidv4();
                  let train = {
                    dest,
                    hexcolor,
                    direction,
                    minutes,
                    stationName,
                    lastTrain: false,
                    stationIdx: idx,
                    id,
                    pos: station.location
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
                        direction,
                        minutes,
                        stationName,
                        lastTrain,
                        stationIdx: idx,
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

    case SAVE_TRAINS:
      const routeNum4 = action.routeNum;
      const allUpdatedTrains = action.trains;
      const curTrains = state[routeNum4];
      // curTrains = Object.assign({}, allUpdatedTrains);

      // const newTrainsforRoute = { [routeNum4]: curTrains };

      return { ...state, [routeNum4]: allUpdatedTrains };

    // case ADD_TRAINS:
    //   const currentRoute = action.route;
    //   const currentRouteHexcolor = currentRoute.hexcolor;
    //   const currentEtas2 = action.etas;
    //   const currentRouteDirection = ROUTES[currentRoute.number].direction;
    //   const currentTrains = state[currentRoute.number].slice();
    //   const currentStations = currentRoute.stations;
    //   const routeDestination2 = ROUTES[currentRoute.number].abbreviation;
    //   let currentStationsSlice = [];
    //   const newTrain5 = [];

    //   if (currentTrains.length > 0) {
    //     const firstTrain = currentTrains[0];
    //     let firstMinutes = firstTrain.minutes;
    //     let firstTrainDestination = firstTrain.dest;
    //     let firstTrainDirection = firstTrain.direction;
    //     let firstHexcolor = firstTrain.hexcolor;
    //     let firstStationIdx = firstTrain.stationIdx;
    //     let currentStationDepartures = currentEtas2[firstTrain.stationName].etd;
    //     let index = findIndex(currentStationDepartures, function(o) {
    //       return (
    //         o.abbreviation === firstTrainDestination &&
    //         o.hexcolor === firstHexcolor
    //       );
    //     });

    //     console.log(index);

    //     if (index > -1) {
    //       let currentMinutes =
    //         currentStationDepartures[index].estimate[0].minutes;
    //       let currentDirection =
    //         currentStationDepartures[index].estimate[0].direction;
    //       let currentHexcolor =
    //         currentStationDepartures[index].estimate[0].hexcolor;
    //       if (
    //         currentMinutes === "Leaving" ||
    //         Number(currentMinutes) <= Number(firstMinutes)
    //       ) {
    //         currentStationsSlice = currentStations.slice(0, firstStationIdx);
    //       } else if (
    //         firstMinutes === "Leaving" &&
    //         currentMinutes !== "Leaving"
    //       ) {
    //         currentStationsSlice = currentStations.slice(
    //           0,
    //           firstStationIdx + 1
    //         );
    //       }

    //       console.log(currentStationsSlice);

    //       if (currentStationsSlice.length > 0) {
    //         currentStationsSlice.map((station, idx4) => {
    //           console.log(station);
    //           let stationName2 = station.stationName;
    //           let departures = currentEtas2[stationName2].etd;
    //           let previousStation = currentStationsSlice[idx4 - 1];

    //           departures.map(departure => {
    //             let dest = departure.abbreviation;
    //             let hex = departure.hexcolor;
    //             if (
    //               routeDestination2.includes(dest) &&
    //               currentRouteHexcolor === hex
    //             ) {
    //               let estimates = departure.estimate;
    //               let minutes = estimates[0].minutes;
    //               let direction = estimates[0].direction;
    //               let hexcolor = estimates[0].hexcolor;
    //               // let id = uuidv4();

    //               let id = uuidv4();

    //               if (minutes === "Leaving") {
    //                 let newTrain = {
    //                   dest,
    //                   minutes,
    //                   direction,
    //                   hexcolor,
    //                   id,
    //                   stationIdx: idx4,
    //                   stationName2
    //                 };
    //                 return newTrain5.push(newTrain);
    //               } else if (previousStation) {
    //                 let prevName = previousStation.stationName;
    //                 console.log(prevName);
    //                 let prevETAs = currentEtas2[prevName];
    //                 console.log(prevName, prevETAs);
    //                 let index2 = findIndex(prevETAs.etd, function(o) {
    //                   return o.abbreviation === dest && o.hexcolor === hexcolor;
    //                 });

    //                 if (index2 > -1) {
    //                   let prevTrains = prevETAs.etd[index2];
    //                   let prevMinutes = prevTrains.estimate[0].minutes;
    //                   let prevHexcolor = prevTrains.estimate[0].hexcolor;
    //                   let prevDirection = prevTrains.estimate[0].direction;

    //                   let diff = Number(minutes) - Number(prevMinutes);
    //                   console.log(diff);
    //                   let distance;
    //                   if (
    //                     departure.estimate[1] &&
    //                     prevTrains.estimate[0].minutes
    //                   ) {
    //                     distance =
    //                       Number(departure.estimate[1].minutes) -
    //                       Number(prevMinutes);
    //                   }

    //                   if (
    //                     diff < 0 ||
    //                     (diff === 0 && Number(minutes) < distance)
    //                   ) {
    //                     let id2 = uuidv4();
    //                     let train = {
    //                       dest,
    //                       hexcolor,
    //                       direction,
    //                       minutes,
    //                       stationName2,
    //                       stationIdx: idx4,
    //                       id: id2
    //                     };
    //                     return newTrain5.push(train);
    //                   }
    //                 }
    //               }
    //             }
    //           });
    //         });
    //       }
    //     }
    //   }

    //   if (newTrain5.length === 0) {
    //     return merge({}, state);
    //   } else if (newTrain5.length > 0) {
    //     let newcombined = newTrain5.concat(currentTrains);
    //     console.log(newTrain5);
    //     console.log(newcombined);
    //     let newTrains3 = newcombined.sort((a, b) =>
    //       a.stationIdx > b.stationIdx ? 1 : -1
    //     );
    //     let newTrains4 = [];
    //     newTrains3.map((ele, idx) => {
    //       if (idx === 0) {
    //         ele["firstTrain"] = true;
    //         newTrains4.push(ele);
    //       } else if (idx !== 0) {
    //         ele["firstTrain"] = false;
    //         newTrains4.push(ele);
    //       }
    //     });

    //     const updRoute = { [currentRoute.number]: newTrains4 };
    //     return merge({}, state, updRoute);
    //   }

    case UPDATE_TRAINS:
      const etas = action.etas;

      let allTrains = state[action.routeNum].slice();
      let stations;
      if (action.routeNum === "2") {
        stations = action.stations.slice(0, -3);
      } else {
        stations = action.stations.slice(0, -1);
      }
      let stationLength = stations.length - 1;
      const updatedTrains = [];

      allTrains.map(train => {
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
          hexcolor: hexcolor,
          direction: direction
        });
        console.log(currentDepartures);
        console.log(lastMinutes);
        // if (index === -1 && lastMinutes === "Leaving") {
        //   let index2 = findIndex(nextStationEstimates, function(o) {
        //     return (
        //       o.abbreviation === trainDestination && o.hexcolor === hexcolor
        //     );
        //   });
        //   console.log(lastStation);

        //   console.log(nextStationName);
        //   console.log(nextStationEstimates);

        //   console.log(index2);

        //   if (index2 > -1) {
        //     let lastTrain = false;

        //     if (train.stationIdx + 1 === stationLength) {
        //       lastTrain = true;
        //     }
        //     let newObj = {
        //       stationName: nextStationName,
        //       stationIdx: train.stationIdx + 1,
        //       minutes: nextStationEstimates[index2].estimate[0].minutes,
        //       departures: nextStationEstimates[index2].estimate[0],
        //       lastTrain
        //     };
        //     console.log(newObj);

        //     let updatedTrain = Object.assign({}, train, newObj);
        //     return updatedTrains.push(updatedTrain);
        //   }
        // }
        if (currentDepartures !== undefined) {
          let currentMinutes = currentDepartures.estimate[0].minutes;
          let currentDirection = currentDepartures.estimate[0].direction;
          let currentHexcolor = currentDepartures.estimate[0].hexcolor;

          if (currentMinutes === lastMinutes) {
            let updatedTrain = Object.assign({}, train);
            return updatedTrains.push(updatedTrain);
          } else if (
            lastMinutes === "Leaving" &&
            currentMinutes !== "Leaving"
          ) {
            let nextDepartures = find(nextStationEstimates, {
              abbreviation: trainDestination,
              hexcolor: hexcolor,
              direction: direction
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
                //departures: nextStationEstimates[index3].estimate[0],
                lastTrain,
                pos: stations[train.stationIdx + 1].location
              };
              console.log(newObj);

              let updatedTrain = Object.assign({}, train, newObj);
              return updatedTrains.push(updatedTrain);
            }
          } else if (
            (currentMinutes === "Leaving" &&
              lastMinutes !== "Leaving" &&
              !train.lastTrain) ||
            Number(currentMinutes) < Number(lastMinutes)
          ) {
            let updObj = {
              minutes: currentMinutes
              //departures: currentStationEstimates[index].estimate[0]
            };

            let updatedTrain = Object.assign({}, train, updObj);
            console.log(updatedTrain);
            return updatedTrains.push(updatedTrain);
          }
        } else if (
          currentDepartures === undefined &&
          lastMinutes === "Leaving"
        ) {
          let nextDepartures = find(nextStationEstimates, {
            abbreviation: trainDestination,
            hexcolor: hexcolor,
            direction: direction
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
              lastTrain
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
