import merge from "lodash/merge";
import {
  RECEIVE_ROUTES,
  RECEIVE_ROUTE_STATIONS,
  routes,
  RECEIVE_CURRENT_ETAS,
  CREATE_TRAINS,
  UPDATE_TRAINS,
  ADD_TRAINS,
  BUILD_WAY_POINTS
} from "../actions/station_actions";
import indexOf from "lodash/indexOf";
import cloneDeep from "lodash/cloneDeep";
import findIndex from "lodash/findIndex";
import * as geolib from "geolib";
import jsonObject from "../waypoints/all_shapes";
import geoJsonObject from "../waypoints/geo_format";
import stations2 from "../waypoints/all_stations";

const ROUTE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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

const allStationsObj = stations2[0];

const routesReducer = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ROUTES:
      const routes = action.routes;

      const newRoutes = {};
      const allKeys = Object.keys(routes);

      allKeys.forEach((ele, idx) => {
        let obj = routes[ele];
        let num = obj.number;
        obj["waypoints"] = jsonObject[Number(num) - 1];
        // let newObj = {};
        // newObj["key"] = "routes";
        // newObj["title"] = obj.name;
        // newObj["id"] = idx;
        // newObj["selected"] = false;
        // newObj["number"] = obj.number;

        newRoutes[num] = Object.assign({}, obj);
      });

      return merge({}, state, newRoutes);

    case RECEIVE_ROUTE_STATIONS:
      const num = action.stations.number;
      const route = state[num];
      const allStations = action.stations.config.station;

      const abc2 = allStations.map((station, idx) => {
        let obj = {};
        let station2Lat = allStationsObj[station].gtfs_latitude;
        let station2Long = allStationsObj[station].gtfs_longitude;
        let arr = [station2Lat, station2Long];
        obj["stationName"] = station;
        obj["trains"] = [];
        obj["location"] = arr;
        obj["stationOrder"] = idx;
        return obj;
      });

      let abc3;

      if (num === "2") {
        abc3 = abc2.slice(0, -3);
      } else if (num === "1") {
        abc3 = abc2.slice(2, -2);
      } else {
        abc3 = abc2.slice(0, -1);
      }

      route["stations"] = abc3;

      const updateRoute = { [route.number]: route };

      return merge({}, state, updateRoute);

    case BUILD_WAY_POINTS:
      const route2 = state[action.routeNum];
      const waypoints = jsonObject[Number(action.routeNum) - 1];
      const geoWaypoints = geoJsonObject[Number(action.routeNum) - 1];
      const stations2 = route2.stations;

      console.log(stations2);

      console.log(waypoints);

      const routeLength = stations2.length - 1;

      const newStations2 = stations2.map((station, idx) => {
        if (idx !== routeLength) {
          let nextStation = stations2[idx + 1];
          let stationLocation = [station.location[1], station.location[0]];
          let nextStationLocation = [
            nextStation.location[1],
            nextStation.location[0]
          ];
          console.log(stationLocation, nextStationLocation);
          let stationCoord = geolib.findNearest(
            stationLocation,
            geoWaypoints.waypoints
          );

          let coordIndex = indexOf(geoWaypoints.waypoints, stationCoord);
          let coord = waypoints.waypoints[coordIndex];
          let geoCoord = geoWaypoints.waypoints[coordIndex];

          let nextStationCoord = geolib.findNearest(
            nextStationLocation,
            geoWaypoints.waypoints
          );

          let nextCoordIndex = indexOf(
            geoWaypoints.waypoints,
            nextStationCoord
          );
          // let geoNextCoordIndex = indexOf(
          //   geoWaypoints.waypoints,
          //   nextStationCoord
          // );

          let nextCoord = waypoints.waypoints[nextCoordIndex];

          let slice = waypoints.waypoints.slice(coordIndex, nextCoordIndex);
          let geoSlice = geoWaypoints.waypoints.slice(
            coordIndex,
            nextCoordIndex
          );
          let meterDistance = geolib.getPathLength(geoSlice);

          console.log(slice);

          let obj = {
            slice,
            meterDistance,
            geoSlice
          };

          let newStation = Object.assign({}, station, obj);

          return newStation;
        } else {
          return station;
        }
      });

      route2["stations"] = newStations2;

      const updateRoute2 = { [route2.number]: route2 };

      return merge({}, state, updateRoute2);

    // case RECEIVE_CURRENT_ETAS:
    //   const allEtas = action.etas;

    //   let obj = {};

    //   let allStationswithEtas = allEtas.map(ele => {
    //     // let station = state[ele.abbr];
    //     // station["etd"] = ele.etd;
    //     obj[ele.abbr] = ele;
    //     // return merge({}, obj, updatedStation);
    //   });

    //   console.log(obj);

    //   const allRoutes = Object.values(state);

    //   const newRoutes2 = allRoutes.map(route => {
    //     let allStations = route.stations;
    //     let routeID = route.number;
    //     let routeDestination;
    //     if (ROUTES[routeID]) {
    //       routeDestination = ROUTES[routeID].abbreviation;
    //     }
    //     let newStations = [];
    //     route.stations = newStations;

    //     console.log(allStations);

    //     if (allStations) {
    //       allStations.map(station => {
    //         let obj2 = {};

    //         console.log(station);
    //         const receivedStation = obj[station.stationName];
    //         let results = [];

    //         if (
    //           receivedStation &&
    //           receivedStation["etd"] !== undefined &&
    //           routeDestination
    //         ) {
    //           receivedStation.etd.map(destination => {
    //             if (routeDestination.includes(destination.abbreviation)) {
    //               // newStations.push({ [station]: destination });
    //               results.push(destination);
    //             }
    //           });
    //         }
    //         // else {
    //         //   obj2[station] = [];
    //         //   newStations.push(obj2);
    //         // }
    //         obj2["stationName"] = station.stationName;
    //         obj2["trains"] = results;
    //         obj2["location"] = station.location;
    //         newStations.push(obj2);
    //       });

    //       return merge({}, state, { [routeID]: route });
    //     }
    //   });
    //   return state;

    // case CREATE_TRAINS:
    //   const route2 = state[action.route];
    //   const routeID = route2.routeID;
    //   const waypoints = route2.waypoints;
    //   let routeStations = route2.stations;
    //   const routeHexcolor = route2.hexcolor;
    //   const routeDirection = ROUTES[route2.number].direction;
    //   const trains = [];
    //   let routeStationNames = routeStations.map(station => {
    //     return station.stationName;
    //   });
    //   if (route2.number === "2") {
    //     routeStations = routeStations.slice(0, -2);
    //     routeStationNames = routeStationNames.slice(0, -2);
    //   }
    //   if (route2.number === "1") {
    //     routeStations = routeStations.slice(0, -1);
    //     routeStationNames = routeStationNames.slice(0, -1);
    //   }

    //   let lastIdx = routeStations.length - 1;

    //   routeStations.map((station, idx) => {
    //     if (idx < lastIdx) {
    //       let stationName = station.stationName;
    //       let departures = station.trains;
    //       let previousStation = routeStations[idx - 1];
    //       let prevName;
    //       if (previousStation) {
    //         prevName = previousStation.stationName;
    //       }
    //       console.log(station);

    //       departures.map(departure => {
    //         let destination = departure.abbreviation;
    //         let destinationLat = allStationsObj[destination].gtfs_latitude;
    //         let destinationLong = allStationsObj[destination].gtfs_longitude;
    //         let destinationLocation = [destinationLat, destinationLong];

    //         let destinationNearestPoint = geolib.findNearest(
    //           destinationLocation,
    //           waypoints.waypoints
    //         );
    //         console.log(destinationLocation, destinationNearestPoint);
    //         let destinationLocationIndex = indexOf(
    //           waypoints.waypoints,
    //           destinationNearestPoint
    //         );
    //         console.log(destinationLocationIndex, stationName);

    //         let destinationIDX = routeStationNames.length - 1;
    //         console.log(destination);
    //         if (previousStation && previousStation.trains) {
    //           let index = findIndex(previousStation.trains, function(o) {
    //             return o.abbreviation === destination;
    //           });
    //           let previousStationDepartures;
    //           if (index > -1) {
    //             previousStationDepartures = previousStation.trains[index];
    //           }
    //           let estimates = departure.estimate;
    //           let minutes = estimates[0].minutes;
    //           let direction = estimates[0].direction;
    //           let hexcolor = estimates[0].hexcolor;
    //           // let id = uuidv4();

    //           let id = uuidv4();

    //           console.log(id);
    //           console.log(minutes, direction, hexcolor);
    //           if (
    //             minutes === "Leaving" &&
    //             direction === routeDirection &&
    //             hexcolor === routeHexcolor &&
    //             idx !== lastIdx - 1
    //           ) {
    //             console.log("leaving", stationName);

    //             let arr2 = station.location;
    //             console.log(arr2, stationName);
    //             let nearestPoint = geolib.findNearest(
    //               arr2,
    //               waypoints.waypoints
    //             );
    //             let stationIdx = indexOf(waypoints["waypoints"], nearestPoint);

    //             console.log(
    //               nearestPoint,
    //               destinationLocationIndex,
    //               stationName
    //             );
    //             let destinationSlice = waypoints.waypoints.slice(
    //               stationIdx,
    //               destinationLocationIndex
    //             );
    //             console.log(destinationSlice, stationName);
    //             let currentDistanceToDestination = geolib.getPathLength(
    //               destinationSlice
    //             );
    //             console.log(
    //               currentDistanceToDestination,
    //               stationName,
    //               destination
    //             );

    //             let nextStation = routeStations[idx + 1];
    //             let nextStationLocation = nextStation.location;

    //             let nextNearestPoint = geolib.findNearest(
    //               nextStationLocation,
    //               waypoints.waypoints
    //             );

    //             let nextIdx = indexOf(waypoints["waypoints"], nextNearestPoint);

    //             let stationSlice = waypoints.waypoints.slice(
    //               stationIdx,
    //               nextIdx
    //             );

    //             console.log(stationSlice);

    //             let currentSlice = [
    //               nearestPoint,
    //               nearestPoint,
    //               nearestPoint,
    //               nearestPoint
    //             ];

    //             let lastLocation = currentSlice[3];

    //             // let firstTrain = false;
    //             // if (idx === 0 || (idx === 1 && stationName === "SFIA")) {
    //             //   firstTrain = true;
    //             // }
    //             // let lastTrain = false;
    //             // if (destinationIDX - idx === 1) {
    //             //   lastTrain = true;
    //             // }
    //             //   let id2 = nextStation.stationName + routeID + estimates[0].platform;
    //             let train = {
    //               slice: arr2,
    //               id: id,
    //               currentLocation: nearestPoint,
    //               station: stationName,
    //               stationSlice,
    //               lastLocation,
    //               destination,
    //               currentSlice,
    //               direction,
    //               hexcolor,
    //               minutes,
    //               id2: id,

    //               nextStation,
    //               stationIdx: idx,

    //               distanceToDestination: currentDistanceToDestination
    //             };
    //             console.log(train);
    //             return trains.push(train);
    //           } else {
    //             let prevStationEstimate;
    //             if (previousStationDepartures) {
    //               prevStationEstimate = previousStationDepartures.estimate[0];
    //             }
    //             let prevStationMinutes;
    //             let prevStationDirection;
    //             let prevStationHexcolor;
    //             if (prevStationEstimate) {
    //               prevStationMinutes = Number(prevStationEstimate.minutes);
    //               prevStationDirection = prevStationEstimate.direction;
    //               prevStationHexcolor = prevStationEstimate.hexcolor;
    //             }
    //             console.log(
    //               stationName,
    //               prevName,
    //               minutes,
    //               prevStationMinutes,
    //               prevStationDirection,
    //               prevStationHexcolor
    //             );

    //             let diff = Number(minutes) - prevStationMinutes;
    //             console.log(diff);
    //             if (
    //               diff < 0 &&
    //               direction === prevStationDirection &&
    //               hexcolor === prevStationHexcolor &&
    //               direction === routeDirection &&
    //               hexcolor === routeHexcolor
    //             ) {
    //               console.log("in-between");
    //               console.log(stationName, prevStationMinutes, diff);

    //               let arr2 = station.location;
    //               // let station3 = allStations[prevName];
    //               // let timeToStation = schedules[prevName].timeToNextStation;
    //               // let station3Lat = station3.gtfs_latitude;
    //               // let station3Long = station3.gtfs_longitude;
    //               let arr3 = previousStation.location;
    //               let nearestPoint = geolib.findNearest(
    //                 arr2,
    //                 waypoints.waypoints
    //               );
    //               let nearestPoint2 = geolib.findNearest(
    //                 arr3,
    //                 waypoints.waypoints
    //               );
    //               console.log(nearestPoint, nearestPoint2);

    //               let stationIdx = indexOf(
    //                 waypoints["waypoints"],
    //                 nearestPoint
    //               );
    //               //   let stationIdx2 = indexOf(waypoints["waypoints"], nearestPoint2);
    //               let stationIdx3 = indexOf(
    //                 waypoints["waypoints"],
    //                 nearestPoint2
    //               );
    //               let waypointsSlice = waypoints.waypoints.slice(
    //                 stationIdx3,
    //                 stationIdx
    //               );
    //               let destinationSlice2 = waypoints.waypoints.slice(
    //                 nearestPoint,
    //                 destinationLocationIndex + 1
    //               );
    //               let currentDistanceToDestination = geolib.getPathLength(
    //                 destinationSlice2
    //               );
    //               console.log(stationIdx, stationIdx3, waypointsSlice);
    //               let distanceToCover = geolib.getPathLength(waypointsSlice);

    //               console.log(distanceToCover, stationName);
    //               let metersBetweenWayPoints = Math.round(
    //                 distanceToCover / waypointsSlice.length
    //               );
    //               console.log(metersBetweenWayPoints, stationName);

    //               const bartSpeed = 12;
    //               let timeInSeconds = Number(minutes) * 60;
    //               let leftToCoverMeters = timeInSeconds * bartSpeed;
    //               console.log(leftToCoverMeters);
    //               let distanceCovered = distanceToCover - leftToCoverMeters;
    //               let currentLocationIdx;

    //               if (distanceCovered <= 0) {
    //                 currentLocationIdx = waypointsSlice.length - 1;
    //               } else {
    //                 currentLocationIdx = Math.round(
    //                   distanceCovered / metersBetweenWayPoints
    //                 );
    //               }
    //               console.log(currentLocationIdx);
    //               let currentLocation = waypointsSlice[currentLocationIdx];
    //               console.log(currentLocation);
    //               let stationIdx6 = indexOf(
    //                 waypoints["waypoints"],
    //                 currentLocation
    //               );
    //               let destinationSlice3 = waypoints.waypoints.slice(
    //                 stationIdx6,
    //                 destinationLocationIndex + 1
    //               );
    //               let currentDistanceToDestination2 = geolib.getPathLength(
    //                 destinationSlice3
    //               );
    //               console.log(
    //                 currentDistanceToDestination2,
    //                 stationName,
    //                 destination
    //               );

    //               let animationTime = 20;
    //               let distanceToCoverForAnimation = 200;
    //               let slice2 = waypointsSlice.slice(currentLocationIdx);
    //               let slice3;
    //               if (slice2.length === 1) {
    //                 slice3 = [slice2[0], slice2[0], slice2[0], slice2[0]];
    //               } else {
    //                 console.log(slice2, stationName);
    //                 let abcd = Math.round(600 / slice2.length);
    //                 let distanceToCover2 = geolib.getPathLength(slice2);
    //                 console.log(distanceToCover2, stationName);
    //                 let metersBetween2 = leftToCoverMeters / slice2.length;
    //                 console.log(metersBetween2, stationName);

    //                 let ratio2 = Math.round(200 / metersBetween2);
    //                 let path = leftToCoverMeters / 600;
    //                 let slice4 = slice2.slice(0, ratio2);
    //                 if (slice4.length < 4) {
    //                   let res = [];
    //                   let count = 0;
    //                   while (count < 4) {
    //                     slice4.forEach(ele => {
    //                       res.push(ele);
    //                       count++;
    //                     });
    //                   }
    //                   slice3 = res;
    //                 } else {
    //                   slice3 = slice4.slice(-4);
    //                 }
    //               }

    //               let lastLocation = slice3[3];
    //               // if (path <= 1) {
    //               //   slice3 = slice2.slice(-10);
    //               // } else {
    //               //   let newPath = Math.round(slice2.length / path);
    //               //   if (newPath >= 10) {
    //               //     slice3 = slice2.slice(0, newPath).slice(0, 11);
    //               //   } else {
    //               //     slice3 = slice2.slice(0, newPath);
    //               //   }
    //               // }

    //               console.log(stationName, slice3);

    //               // let nums = path / metersBetween;

    //               // if (ratio2 === 1) {
    //               //     slice3 = slice2;
    //               // }
    //               // else if (ratio > 0.5) {
    //               //       let sliceCenter7 = geolib.getCenter(slice2);
    //               //   let nearestPoint5 = geolib.findNearest(sliceCenter2, slice4);
    //               //   let stationIdx5 = indexOf(slice4, nearestPoint5);
    //               //   nearestPoint5 = slice4[stationIdx5 + 10];
    //               // }

    //               console.log(
    //                 timeInSeconds,
    //                 leftToCoverMeters,
    //                 distanceToCover,
    //                 distanceCovered,
    //                 currentLocationIdx,
    //                 waypointsSlice.length,
    //                 currentLocation,
    //                 stationName,
    //                 destination,
    //                 routeID,
    //                 slice3
    //               );

    //               // let firstTrain = false;
    //               // if (idx === 1 || (idx == 2 && prevName === "SFIA")) {
    //               //   firstTrain = true;
    //               // }
    //               let lastTrain = false;
    //               if (idx === lastIdx - 1) {
    //                 lastTrain = true;
    //               }

    //               let train = {
    //                 currentLocation,
    //                 direction: direction,
    //                 destination: destination,

    //                 hexcolor,
    //                 stationSlice: slice2,
    //                 currentSlice: slice3,
    //                 id: id,
    //                 minutes: minutes,
    //                 slice: slice3,
    //                 station: stationName,
    //                 stationIdx: idx,
    //                 lastTrain,
    //                 lastLocation,

    //                 distanceToDestination: currentDistanceToDestination2
    //               };
    //               console.log(train);
    //               trains.push(train);

    //               // let ratio = Number(minutes) / Number(timeToStation);
    //               // console.log(ratio);
    //               // // waypointsSlice = waypointsSlice.slice(
    //               // //   Math.round(waypointsSlice.length * ratio)
    //               // // );
    //               // let sliceCenter = geolib.getCenter(waypointsSlice);

    //               // let nearestPoint4 = geolib.findNearest(sliceCenter, waypointsSlice);
    //               // let stationIdx4 = indexOf(waypointsSlice, nearestPoint4);
    //               // nearestPoint4 = waypointsSlice[stationIdx4];
    //               // console.log(nearestPoint4);
    //               // console.log(stationIdx4);

    //               // if (ratio === 0.5) {
    //               //   let train = {
    //               //     location: nearestPoint4,
    //               //     id: id,
    //               //     station: stationName
    //               //   };

    //               //   console.log(train);
    //               //   trains.push(train);
    //               // } else if (ratio < 0.5) {
    //               //   let slice4 = waypointsSlice.slice(0, stationIdx4);
    //               //   let sliceCenter2 = geolib.getCenter(slice4);
    //               //   let nearestPoint5 = geolib.findNearest(sliceCenter2, slice4);
    //               //   let stationIdx5 = indexOf(slice4, nearestPoint5);
    //               //   nearestPoint5 = slice4[stationIdx5 + 10];
    //               //   let train = {
    //               //     location: nearestPoint5,
    //               //     id: id,
    //               //     station: stationName
    //               //   };
    //               //   console.log(train);
    //               //   trains.push(train);
    //               // } else {
    //               //   let slice5 = waypointsSlice.slice(
    //               //     stationIdx4,
    //               //     waypointsSlice.length
    //               //   );
    //               //   let sliceCenter3 = geolib.getCenter(slice5);
    //               //   let nearestPoint6 = geolib.findNearest(sliceCenter3, slice5);
    //               //   let stationIdx6 = indexOf(slice5, nearestPoint6);
    //               //   nearestPoint6 = slice5[stationIdx6];
    //               //   let train = {
    //               //     location: nearestPoint6,
    //               //     id: id,
    //               //     station: stationName
    //               //   };
    //               //   console.log(train);
    //               //   trains.push(train);
    //               // }
    //             }
    //           }
    //         }
    //       });
    //     }
    //   });
    //   let trains2 = trains.sort((a, b) =>
    //     a.stationIdx > b.stationIdx ? 1 : -1
    //   );
    //   console.log(trains);
    //   console.log(trains2);

    //   let trains3 = [];
    //   trains2.map((ele, idx) => {
    //     if (idx === 0) {
    //       ele["firstTrain"] = true;
    //       trains3.push(ele);
    //     } else {
    //       ele["firstTrain"] = false;
    //       trains3.push(ele);
    //     }
    //   });
    //   console.log(trains3);
    //   route2["trains"] = trains3;
    //   const updatedRoute2 = { [route2.number]: route2 };
    //   return merge({}, state, updatedRoute2);

    // case UPDATE_TRAINS:
    //   const route4 = state[action.route];
    //   const routeID2 = route4.routeID;
    //   const waypoints2 = route4.waypoints;
    //   let routeStations2 = route4.stations;
    //   const routeHexcolor2 = route4.hexcolor;
    //   const routeDirection2 = ROUTES[route4.number].direction;
    //   const routeTrains = route4.trains.slice();
    //   let firstTrainId;
    //   if (routeTrains.length > 0) {
    //     firstTrainId = routeTrains[0].id;
    //   }
    //   console.log(routeTrains);
    //   const bartSpeed2 = 12;

    //   let routeStationNames2 = routeStations2.map(station => {
    //     return station.stationName;
    //   });
    //   if (route4.number === "2") {
    //     routeStations2 = routeStations2.slice(0, -2);
    //     routeStationNames2 = routeStationNames2.slice(0, -2);
    //   }

    //   let lastIdx2 = routeStations2.length - 1;

    //   const newTrains = [];

    //   routeTrains.map((train, idx) => {
    //     console.log(train);
    //     let obj = {};
    //     let destination = train.destination;
    //     let direction = train.direction;
    //     let station = train.station;
    //     let hexcolor = train.hexcolor;
    //     let lastMinutes = train.minutes;
    //     let stationIndex = train.stationIdx;
    //     let stationSlice = train.stationSlice;
    //     let stationLocation = routeStations2[stationIndex].location;
    //     let stationCurrentDepartures = routeStations2[stationIndex].trains;
    //     let index = findIndex(stationCurrentDepartures, function(o) {
    //       return o.abbreviation === destination;
    //     });
    //     let currentDepartureMinutes;
    //     let currentDirection;
    //     let currentHexcolor;
    //     console.log(index);
    //     if (index > -1) {
    //       currentDepartureMinutes =
    //         stationCurrentDepartures[index].estimate[0].minutes;
    //       currentDirection =
    //         stationCurrentDepartures[index].estimate[0].direction;
    //       currentHexcolor =
    //         stationCurrentDepartures[index].estimate[0].hexcolor;
    //     }
    //     console.log(lastMinutes, currentDepartureMinutes, station, train);
    //     console.log(train.id);
    //     let nextStationIndex = stationIndex + 1;
    //     let nextStationName = routeStations2[nextStationIndex].stationName;
    //     let nextStationDepartures = routeStations2[nextStationIndex].trains;

    //     let nextIndex = findIndex(nextStationDepartures, function(o) {
    //       return o.abbreviation === destination;
    //     });
    //     if (lastMinutes === "Leaving") {
    //       if (
    //         currentDepartureMinutes === "Leaving" &&
    //         currentDirection === direction &&
    //         currentHexcolor === hexcolor
    //       ) {
    //         return newTrains.push(train);
    //       } else if (currentDepartureMinutes !== "Leaving" && nextIndex > -1) {
    //         let nextDeparture = nextStationDepartures[nextIndex].estimate[0];
    //         if (
    //           nextDeparture.direction === direction &&
    //           nextDeparture.hexcolor === hexcolor
    //         ) {
    //           if (nextStationIndex === lastIdx2 - 1) {
    //             obj["lastTrain"] = true;
    //           }
    //           let nextDepartureMinutes = nextDeparture.minutes;
    //           console.log(nextDepartureMinutes);
    //           let distanceToCover = geolib.getPathLength(stationSlice);
    //           console.log(distanceToCover);
    //           let metersBetweenWayPoints = Math.round(
    //             distanceToCover / stationSlice.length
    //           );
    //           console.log(metersBetweenWayPoints);
    //           let timeInSeconds = Number(nextDepartureMinutes) * 60;

    //           let leftToCoverMeters = timeInSeconds * bartSpeed2;
    //           let distanceCovered = distanceToCover - leftToCoverMeters;
    //           let currentLocationIdx;

    //           if (distanceCovered <= 0) {
    //             currentLocationIdx = stationSlice.length - 1;
    //           } else {
    //             currentLocationIdx = Math.round(
    //               distanceCovered / metersBetweenWayPoints
    //             );
    //           }
    //           console.log(currentLocationIdx);
    //           let currentLocation = stationSlice[currentLocationIdx];
    //           let currentSlice;

    //           let sliceToStation = stationSlice.slice(currentLocationIdx);
    //           if (sliceToStation.length === 1) {
    //             currentSlice = [
    //               sliceToStation[0],
    //               sliceToStation[0],
    //               sliceToStation[0],
    //               sliceToStation[0]
    //             ];
    //           } else {
    //             let metersBetween2 = leftToCoverMeters / sliceToStation.length;
    //             let ratio2 = Math.round(200 / metersBetween2);
    //             let slice4 = sliceToStation.slice(0, ratio2);
    //             if (slice4.length < 4) {
    //               let res = [];
    //               let count = 0;
    //               while (count < 4) {
    //                 slice4.forEach(ele => {
    //                   res.push(ele);
    //                   count++;
    //                 });
    //               }
    //               currentSlice = res;
    //             } else {
    //               currentSlice = slice4.slice(-4);
    //             }
    //           }
    //           let lastLocation = currentSlice[3];
    //           obj["lastLocation"] = lastLocation;
    //           obj["currentLocation"] = currentLocation;
    //           obj["minutes"] = nextDepartureMinutes;
    //           obj["station"] = routeStations2[nextStationIndex].stationName;
    //           obj["stationIdx"] = nextStationIndex;
    //           obj["stationSlice"] = sliceToStation;
    //           obj["currentSlice"] = currentSlice;
    //           console.log(obj);
    //           let newTrain = Object.assign({}, train, obj);
    //           console.log(newTrain);
    //           newTrains.push(newTrain);
    //         }
    //       }
    //     } else if (
    //       lastMinutes !== "Leaving" &&
    //       currentDirection === direction &&
    //       currentHexcolor === hexcolor
    //     ) {
    //       if (
    //         currentDepartureMinutes === "Leaving" &&
    //         stationIndex !== lastIdx2 - 1
    //       ) {
    //         let nearestPoint = geolib.findNearest(
    //           stationLocation,
    //           waypoints2.waypoints
    //         );
    //         let stationIdx = indexOf(waypoints2["waypoints"], nearestPoint);
    //         let nextStationIndex = stationIndex + 1;
    //         let nextStationLocation = routeStations2[nextStationIndex].location;
    //         let nextNearestPoint = geolib.findNearest(
    //           nextStationLocation,
    //           waypoints2.waypoints
    //         );
    //         let nextIdx = indexOf(waypoints2["waypoints"], nextNearestPoint);

    //         let stationSlice = waypoints2.waypoints.slice(stationIdx, nextIdx);
    //         console.log(stationSlice);

    //         let currentSlice = [
    //           nearestPoint,
    //           nearestPoint,
    //           nearestPoint,
    //           nearestPoint
    //         ];

    //         let lastLocation = currentSlice[3];
    //         obj["currentLocation"] = nearestPoint;
    //         obj["stationSlice"] = stationSlice;
    //         obj["lastLocation"] = lastLocation;
    //         obj["currentSlice"] = currentSlice;
    //         obj["minutes"] = currentDepartureMinutes;
    //         let newTrain = Object.assign({}, train, obj);
    //         console.log(newTrain);
    //         return newTrains.push(newTrain);
    //       } else if (Number(currentDepartureMinutes) < Number(lastMinutes)) {
    //         let lastSlice = train.currentSlice.slice();
    //         let slice3;
    //         console.log(lastSlice, train);
    //         let lastLocation = train.lastLocation;
    //         let lastIndex = indexOf(
    //           stationSlice,
    //           lastSlice[lastSlice.length - 1]
    //         );
    //         console.log(lastIndex, train);
    //         let newStationSlice = stationSlice.slice(lastIndex);

    //         console.log(newStationSlice, train);

    //         if (newStationSlice.length === 1) {
    //           slice3 = [
    //             newStationSlice[0],
    //             newStationSlice[0],
    //             newStationSlice[0],
    //             newStationSlice[0]
    //           ];
    //         } else {
    //           let distanceToCover2 = geolib.getPathLength(newStationSlice);
    //           let timeInSeconds = Number(currentDepartureMinutes) * 60;
    //           let leftToCoverMeters = timeInSeconds * bartSpeed2;
    //           console.log(leftToCoverMeters, train);
    //           let metersBetween2 = distanceToCover2 / newStationSlice.length;
    //           console.log(metersBetween2, train);
    //           let ratio2 = leftToCoverMeters / distanceToCover2;
    //           let newIdx = Math.ceil(ratio2 * newStationSlice.length);
    //           let slice4 = newStationSlice.slice(0, newIdx);
    //           console.log(slice4, train);
    //           if (slice4.length < 4) {
    //             let res = [];
    //             let count = 0;
    //             while (count < 4) {
    //               slice4.forEach(ele => {
    //                 res.push(ele);
    //                 count++;
    //               });
    //             }
    //             slice3 = res;
    //           } else {
    //             slice3 = slice4.slice(-4);
    //           }
    //         }
    //         let lastLocation2 = slice3[3];
    //         console.log(slice3, train);
    //         obj["currentLocation"] = newStationSlice[0];
    //         obj["minutes"] = currentDepartureMinutes;
    //         obj["currentSlice"] = slice3;
    //         obj["stationSlice"] = newStationSlice;
    //         obj["lastLocation"] = lastLocation2;

    //         let newTrain = Object.assign({}, train, obj);
    //         console.log(newTrain);
    //         newTrains.push(newTrain);
    //       } else if (Number(currentDepartureMinutes) === Number(lastMinutes)) {
    //         newTrains.push(train);
    //       }
    //     }
    //   });

    //   const newT = [];
    //   const newTrainsCopy = newTrains.slice();
    //   console.log(newTrainsCopy);

    //   const firstTrainIdx = findIndex(newTrainsCopy, function(o) {
    //     return o.id === firstTrainId;
    //   });
    //   console.log(firstTrainIdx);

    //   if (firstTrainIdx > -1) {
    //     let firstTrain = newTrainsCopy[firstTrainIdx];
    //     console.log(firstTrain);
    //     let firstStationIdx = firstTrain.stationIdx;
    //     console.log(firstStationIdx);

    //     let firstStations = routeStations2.slice(0, firstStationIdx);
    //     console.log(firstStations);

    //     if (firstStations.length > 0)
    //       firstStations.map((station, idx3) => {
    //         let stationName = station.stationName;
    //         let departures = station.trains;
    //         let previousStation = firstStations[idx3 - 1];
    //         let prevName;
    //         if (previousStation) {
    //           prevName = previousStation.stationName;
    //         }

    //         departures.map(departure => {
    //           let destination = departure.abbreviation;
    //           let destinationLat = allStationsObj[destination].gtfs_latitude;
    //           let destinationLong = allStationsObj[destination].gtfs_longitude;
    //           let destinationLocation = [destinationLat, destinationLong];

    //           let destinationNearestPoint = geolib.findNearest(
    //             destinationLocation,
    //             waypoints2.waypoints
    //           );
    //           console.log(destinationLocation, destinationNearestPoint);
    //           let destinationLocationIndex = indexOf(
    //             waypoints2.waypoints,
    //             destinationNearestPoint
    //           );
    //           console.log(destinationLocationIndex, stationName);

    //           // let destinationIDX = routeStationNames.length - 1;
    //           console.log(destination);
    //           if (previousStation && previousStation.trains) {
    //             let index = findIndex(previousStation.trains, function(o) {
    //               return o.abbreviation === destination;
    //             });
    //             let previousStationDepartures;
    //             if (index > -1) {
    //               previousStationDepartures = previousStation.trains[index];
    //             }
    //             let estimates = departure.estimate;
    //             let minutes = estimates[0].minutes;
    //             let direction = estimates[0].direction;
    //             let hexcolor = estimates[0].hexcolor;
    //             // let id = uuidv4();

    //             let id = uuidv4();

    //             console.log(id);
    //             console.log(minutes, direction, hexcolor);
    //             if (
    //               minutes === "Leaving" &&
    //               direction === routeDirection2 &&
    //               hexcolor === routeHexcolor2 &&
    //               idx3 !== lastIdx2 - 1
    //             ) {
    //               console.log("leaving", stationName);

    //               let arr2 = station.location;
    //               console.log(arr2, stationName);
    //               let nearestPoint = geolib.findNearest(
    //                 arr2,
    //                 waypoints2.waypoints
    //               );
    //               let stationIdx = indexOf(
    //                 waypoints2["waypoints"],
    //                 nearestPoint
    //               );
    //               console.log(
    //                 nearestPoint,
    //                 destinationLocationIndex,
    //                 stationName
    //               );
    //               let destinationSlice = waypoints2.waypoints.slice(
    //                 stationIdx,
    //                 destinationLocationIndex
    //               );
    //               console.log(destinationSlice, stationName);
    //               let currentDistanceToDestination = geolib.getPathLength(
    //                 destinationSlice
    //               );
    //               console.log(
    //                 currentDistanceToDestination,
    //                 stationName,
    //                 destination
    //               );

    //               let nextStation = routeStations2[idx3 + 1];
    //               let nextStationLocation = nextStation.location;

    //               let nextNearestPoint = geolib.findNearest(
    //                 nextStationLocation,
    //                 waypoints2.waypoints
    //               );

    //               let nextIdx = indexOf(
    //                 waypoints2["waypoints"],
    //                 nextNearestPoint
    //               );

    //               let stationSlice = waypoints2.waypoints.slice(
    //                 stationIdx,
    //                 nextIdx
    //               );

    //               let currentSlice = [
    //                 nearestPoint,
    //                 nearestPoint,
    //                 nearestPoint,
    //                 nearestPoint
    //               ];

    //               let lastLocation = currentSlice[3];

    //               // let firstTrain = false;
    //               // if (idx === 0 || (idx === 1 && stationName === "SFIA")) {
    //               //   firstTrain = true;
    //               // }
    //               // let lastTrain = false;
    //               // if (destinationIDX - idx === 1) {
    //               //   lastTrain = true;
    //               // }
    //               //   let id2 = nextStation.stationName + routeID + estimates[0].platform;
    //               let train = {
    //                 slice: arr2,
    //                 id: id,
    //                 currentLocation: nearestPoint,
    //                 station: stationName,
    //                 stationSlice,
    //                 lastLocation,
    //                 destination,
    //                 currentSlice,
    //                 direction,
    //                 hexcolor,
    //                 minutes,
    //                 id2: id,

    //                 nextStation,
    //                 stationIdx: idx3,

    //                 distanceToDestination: currentDistanceToDestination
    //               };
    //               return newT.push(train);
    //             } else {
    //               let prevStationEstimate;
    //               if (previousStationDepartures) {
    //                 prevStationEstimate = previousStationDepartures.estimate[0];
    //               }
    //               let prevStationMinutes;
    //               let prevStationDirection;
    //               let prevStationHexcolor;
    //               if (prevStationEstimate) {
    //                 prevStationMinutes = Number(prevStationEstimate.minutes);
    //                 prevStationDirection = prevStationEstimate.direction;
    //                 prevStationHexcolor = prevStationEstimate.hexcolor;
    //               }
    //               console.log(
    //                 stationName,
    //                 prevName,
    //                 minutes,
    //                 prevStationMinutes,
    //                 prevStationDirection,
    //                 prevStationHexcolor
    //               );

    //               let diff = Number(minutes) - prevStationMinutes;
    //               console.log(diff);
    //               if (
    //                 diff < 0 &&
    //                 direction === prevStationDirection &&
    //                 hexcolor === prevStationHexcolor &&
    //                 direction === routeDirection2 &&
    //                 hexcolor === routeHexcolor2
    //               ) {
    //                 console.log("in-between");
    //                 console.log(stationName, prevStationMinutes, diff);

    //                 let arr2 = station.location;
    //                 // let station3 = allStations[prevName];
    //                 // let timeToStation = schedules[prevName].timeToNextStation;
    //                 // let station3Lat = station3.gtfs_latitude;
    //                 // let station3Long = station3.gtfs_longitude;
    //                 let arr3 = previousStation.location;
    //                 let nearestPoint = geolib.findNearest(
    //                   arr2,
    //                   waypoints2.waypoints
    //                 );
    //                 let nearestPoint2 = geolib.findNearest(
    //                   arr3,
    //                   waypoints2.waypoints
    //                 );
    //                 console.log(nearestPoint, nearestPoint2);

    //                 let stationIdx = indexOf(
    //                   waypoints2["waypoints"],
    //                   nearestPoint
    //                 );
    //                 //   let stationIdx2 = indexOf(waypoints["waypoints"], nearestPoint2);
    //                 let stationIdx3 = indexOf(
    //                   waypoints2["waypoints"],
    //                   nearestPoint2
    //                 );
    //                 let waypointsSlice = waypoints2.waypoints.slice(
    //                   stationIdx3,
    //                   stationIdx
    //                 );
    //                 let destinationSlice2 = waypoints2.waypoints.slice(
    //                   nearestPoint,
    //                   destinationLocationIndex + 1
    //                 );
    //                 let currentDistanceToDestination = geolib.getPathLength(
    //                   destinationSlice2
    //                 );
    //                 console.log(stationIdx, stationIdx3, waypointsSlice);
    //                 let distanceToCover = geolib.getPathLength(waypointsSlice);

    //                 console.log(distanceToCover, stationName);
    //                 let metersBetweenWayPoints = Math.round(
    //                   distanceToCover / waypointsSlice.length
    //                 );

    //                 const bartSpeed = 12;
    //                 let timeInSeconds = Number(minutes) * 60;
    //                 let leftToCoverMeters = timeInSeconds * bartSpeed;
    //                 console.log(leftToCoverMeters);
    //                 let distanceCovered = distanceToCover - leftToCoverMeters;
    //                 let currentLocationIdx;

    //                 if (distanceCovered <= 0) {
    //                   currentLocationIdx = waypointsSlice.length - 1;
    //                 } else {
    //                   currentLocationIdx = Math.round(
    //                     distanceCovered / metersBetweenWayPoints
    //                   );
    //                 }
    //                 let currentLocation = waypointsSlice[currentLocationIdx];
    //                 let stationIdx6 = indexOf(
    //                   waypoints2["waypoints"],
    //                   currentLocation
    //                 );
    //                 let destinationSlice3 = waypoints2.waypoints.slice(
    //                   stationIdx6,
    //                   destinationLocationIndex + 1
    //                 );
    //                 let currentDistanceToDestination2 = geolib.getPathLength(
    //                   destinationSlice3
    //                 );
    //                 console.log(
    //                   currentDistanceToDestination2,
    //                   stationName,
    //                   destination
    //                 );
    //                 let animationTime = 20;
    //                 let distanceToCoverForAnimation = 200;
    //                 let slice2 = waypointsSlice.slice(currentLocationIdx);
    //                 let slice3;
    //                 if (slice2.length === 1) {
    //                   slice3 = [slice2[0], slice2[0], slice2[0], slice2[0]];
    //                 } else {
    //                   console.log(slice2, stationName);
    //                   let abcd = Math.round(600 / slice2.length);
    //                   let distanceToCover2 = geolib.getPathLength(slice2);
    //                   console.log(distanceToCover2, stationName);
    //                   let metersBetween2 = leftToCoverMeters / slice2.length;
    //                   console.log(metersBetween2, stationName);

    //                   let ratio2 = Math.round(200 / metersBetween2);
    //                   let path = leftToCoverMeters / 600;
    //                   let slice4 = slice2.slice(0, ratio2);
    //                   if (slice4.length < 4) {
    //                     let res = [];
    //                     let count = 0;
    //                     while (count < 4) {
    //                       slice4.forEach(ele => {
    //                         res.push(ele);
    //                         count++;
    //                       });
    //                     }
    //                     slice3 = res;
    //                   } else {
    //                     slice3 = slice4.slice(-4);
    //                   }
    //                 }

    //                 let lastLocation = slice3[3];

    //                 console.log(
    //                   timeInSeconds,
    //                   leftToCoverMeters,
    //                   distanceToCover,
    //                   distanceCovered,
    //                   currentLocationIdx,
    //                   waypointsSlice.length,
    //                   currentLocation,
    //                   stationName,
    //                   destination,

    //                   slice3
    //                 );

    //                 // let firstTrain = false;
    //                 // if (idx === 1 || (idx == 2 && prevName === "SFIA")) {
    //                 //   firstTrain = true;
    //                 // }
    //                 // let lastTrain = false;
    //                 // if (destinationIDX - idx === 1) {
    //                 //   lastTrain = true;
    //                 // }
    //                 let lastTrain = false;
    //                 // if (idx3 === lastIdx - 1) {
    //                 //   lastTrain = true;
    //                 // }

    //                 let train = {
    //                   currentLocation,
    //                   direction: direction,
    //                   destination: destination,

    //                   hexcolor,
    //                   stationSlice: slice2,
    //                   currentSlice: slice3,
    //                   id: id,
    //                   minutes: minutes,
    //                   slice: slice3,
    //                   station: stationName,
    //                   stationIdx: idx3,
    //                   lastTrain,
    //                   lastLocation,

    //                   distanceToDestination: currentDistanceToDestination2
    //                 };
    //                 return newT.push(train);
    //               }
    //             }
    //           }
    //         });
    //       });
    //   }

    //   console.log(routeTrains, newTrains);
    //   console.log(newT);

    //   let newTrains2 = [...newT, ...newTrains];
    //   console.log(newTrains2);
    //   let newTrains3 = newTrains2.sort((a, b) =>
    //     a.stationIdx > b.stationIdx ? 1 : -1
    //   );
    //   console.log(newTrains3);
    //   let newTrains4 = [];
    //   newTrains3.map((ele, idx) => {
    //     if (idx === 0) {
    //       ele["firstTrain"] = true;
    //       newTrains4.push(ele);
    //     } else if (idx !== 0) {
    //       ele["firstTrain"] = false;
    //       newTrains4.push(ele);
    //     }
    //   });
    //   console.log(newTrains4);
    //   route4["trains"] = newTrains4;
    //   const updatedRoute4 = { [route4.number]: route4 };
    //   return merge({}, state, updatedRoute4);

    default:
      return state;
  }
};

export default routesReducer;
