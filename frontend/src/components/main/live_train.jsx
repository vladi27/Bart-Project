import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component, PureComponent } from "react";
import * as geolib from "geolib";
import uniqueId from "lodash/uniqueId";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import TrainContainer from "./train_container";
import findIndex from "lodash/findIndex";
let toTime = require("to-time");
var geodist = require("geodist");
const uuidv4 = require("uuid/v4");

// const LiveTrain extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.id = uniqueId();
//     console.log(this.props);
// this.state = {
//  allTrains: []
//   }
// };
// this.state = {
//   destinations: []
// };

//     // this.state = { stations: this.props.selectedRoute.stations || [] };
//   }

//   componentDidMount() {
//     console.log("hello");
//   }

const LiveTrain = props => {
  const currentDeparture = props.departure;
  const station = props.station;
  const stationName = station.currentName;
  const currentStationID = props.stationId;
  const departureID = props.departureID;
  const allStations = props.allStations;
  const routeLength = props.routeLength;
  const delay = Number(props.delay);
  const direction = props.direction;

  const currentDestinationName = props.currentDestinationName;
  const currentDestination = allStations[currentDestinationName];

  const firstStationName = props.firstStation;
  const waypoints = props.waypoints;
  const hexcolor = props.hexcolor;
  const prevStationDepartures = props.prevStationDepartures;
  const platform = props.platform;

  //   const id =
  //     String(currentStationID) +
  //     String(departureID) +
  //     hexcolor +
  //     direction +
  //     currentDestinationName;
  const id = props.id;
  console.log(props);
  console.log(stationName);
  console.log(prevStationDepartures);

  console.log(firstStationName);
  console.log(delay, stationName);
  console.log(currentDestination);

  console.log(currentStationID, stationName, currentDeparture, platform, id);

  if (currentDestinationName === stationName) {
    return <div></div>;
  }

  if (
    (stationName === firstStationName &&
      currentDeparture !== "Leaving" &&
      currentStationID === 0) ||
    (currentStationID === routeLength - 1 && currentDeparture === "Leaving")
  ) {
    console.log("first Station");
    return <div></div>;
  }

  if (currentStationID === 0 && currentDeparture === "Leaving" && delay > 0) {
    return <div></div>;
  }

  if (currentStationID === 0 && currentDeparture === "Leaving" && delay === 0) {
    let distance;
    console.log("first station leaving", stationName);
    let stationLocation = allStations[stationName].location;

    distance = geolib.getDistance(
      allStations[stationName].location,
      currentDestination.location
    );

    let timeToDestination = allStations[stationName].timeToDestination;
    console.log(distance, station.name);

    let nearestPoint = geolib.findNearest(
      allStations[stationName].location,
      waypoints.waypoints
    );
    let nearestPoint3;

    nearestPoint3 = geolib.findNearest(
      currentDestination.location,
      waypoints.waypoints
    );

    //   let stationIdx = indexOf(waypoints.waypoints, nearestPoint);
    //   // let stationIdx2 = indexOf(waypoints2.waypoints, nearestPoint2);
    //   let stationIdx3 = indexOf(waypoints.waypoints, nearestPoint3);

    //   let waypointsSlice = waypoints.waypoints.slice(
    //     stationIdx,
    //     stationIdx3 + 1
    //   );

    //   console.log(waypointsSlice);
    //   let metersBetweenWayPoints;

    //   metersBetweenWayPoints = Math.round(distance / waypointsSlice.length);

    //   console.log(metersBetweenWayPoints);

    //   let ms2;

    //   console.log(timeToDestination, waypointsSlice);

    //   let wpm = Math.round((timeToDestination * 60) / waypointsSlice.length);
    //   ms2 = toTime.fromSeconds(wpm).ms();

    //   console.log(ms2);

    //   let ms3 = ms2 || 4000;
    // let train = {
    //   markers: waypointsSlice,
    //   color: route.hexcolor,
    //   interval: ms3,
    //   station: station
    // };
    // console.log(train);
    let ms3 = 20000;

    return (
      <TrainContainer
        markers={[stationLocation, stationLocation]}
        color={hexcolor}
        fetchStationDepartures={props.fetchStationDepartures}
        interval={1200000}
        nextStation={stationName}
        key={id}
        id={id}
      />
    );
  }

  if (
    currentStationID === 1 &&
    hexcolor === "#ff9933" &&
    stationName === "FRMT" &&
    Number(currentDeparture) <= 6
  ) {
    console.log("FRMT");
    let nearestPoint = geolib.findNearest(
      allStations[stationName].location,
      waypoints.waypoints
    );
    //   let nearestPoint2 = geolib.findNearest(
    //     nextStation.location,
    //     waypoints.waypoints
    //   );

    let nearestPoint3;
    // let nearestPoint2 = geolib.findNearest(
    //   nextStation.location,
    //   waypoints2.waypoints
    // );

    nearestPoint3 = geolib.findNearest(
      currentDestination.location,
      waypoints.waypoints
    );

    //   console.log(nearestPoint);
    //   console.log(nearestPoint2);
    let stationIdx = indexOf(waypoints["waypoints"], nearestPoint);
    //   let stationIdx2 = indexOf(waypoints["waypoints"], nearestPoint2);
    let stationIdx3 = indexOf(waypoints["waypoints"], nearestPoint3);

    console.log(stationIdx);
    console.log(stationIdx3);
    let nextStation = allStations[stationName].nextStation;

    let waypointsSlice2 = waypoints.waypoints.slice(stationIdx, stationIdx3);

    console.log(waypointsSlice2);
    // let distance2 = geolib.getDistance(
    //   waypointsSlice2[0],
    //   waypointsSlice2[waypointsSlice2.length - 1]
    // );
    let distanceToCover = geolib.getPathLength(waypointsSlice2);
    console.log(distanceToCover, station.name);

    //   let distanceCovered = nextStationTimetoArrive / timeToNextStation;

    let distanceCovered =
      1 - waypointsSlice2.length / waypoints.waypoints.length;

    let abc = Math.round(waypoints.waypoints.length * distanceCovered);
    let slice3 = waypoints.waypoints.slice(abc, stationIdx3);

    let newDistance = geolib.getPathLength(slice3);

    console.log(newDistance, distanceToCover);

    let metersBetweenWayPoints;

    metersBetweenWayPoints = Math.round(newDistance / slice3.length);
    console.log(metersBetweenWayPoints);
    // console.log(waypointsSlice);
    // console.log(route);

    let ms2;
    if (timeToDestination) {
      let wpm = Math.round((timeToDestination * 60) / slice3.length);
      ms2 = toTime.fromSeconds(wpm).ms();
    }
    console.log(ms2);

    let ms3 = ms2 || 5000;

    return (
      <TrainContainer
        markers={slice3}
        color={hexcolor}
        interval={ms3}
        fetchStationDepartures={props.fetchStationDepartures}
        nextStation={nextStation}
        key={id}
        id={id}
      />
    );
  }

  if (currentStationID === 0 && stationName !== firstStationName) {
    let prevStationName = allStations[stationName].previousStation;

    let prevStation = allStations[prevStationName];
    console.log(prevStation, stationName);
    console.log("first station", stationName);
    console.log(stationName, firstStationName, currentStationID);
    let timeToCurrentStation = prevStation.timeToNextStation;
    let prevLocation = prevStation.location;
    let currentLocation = allStations[stationName].location;

    console.log(prevLocation, currentLocation);

    if (!timeToCurrentStation) {
      let dist = geodist(prevLocation, currentLocation, { unit: "meters" });
      console.log(dist);
      let distanceBetweenTwoStations = geolib.getPreciseDistance(
        prevLocation,
        currentLocation
      );
      console.log(distanceBetweenTwoStations);
      const bartSpeed = 500;
      timeToCurrentStation = Math.ceil(dist / bartSpeed);
    }

    console.log(currentDeparture, timeToCurrentStation, stationName);

    let timeToDestination = prevStation.timeToDestination;

    if (!timeToDestination) {
      timeToDestination =
        timetoCurrentStation +
        Number(allStations[stationName].timeToDestination);
    }

    if (Number(currentDeparture) <= Number(timetoCurrentStation)) {
      console.log(
        currentDeparture,
        timeToCurrentStation,
        prevStation,
        stationName
      );
      console.log("first station", stationName);
      //   console.log(stationName, currentDeparture);
      //   console.log(stationName, timetoCurrentStation, currentDeparture);
      let nearestPoint = geolib.findNearest(
        allStations[stationName].location,
        waypoints.waypoints
      );
      //   let nearestPoint2 = geolib.findNearest(
      //     nextStation.location,
      //     waypoints.waypoints
      //   );

      let nearestPoint3;
      // let nearestPoint2 = geolib.findNearest(
      //   nextStation.location,
      //   waypoints2.waypoints
      // );

      nearestPoint3 = geolib.findNearest(
        currentDestination.location,
        waypoints.waypoints
      );

      //   console.log(nearestPoint);
      //   console.log(nearestPoint2);
      let stationIdx = indexOf(waypoints["waypoints"], nearestPoint);
      //   let stationIdx2 = indexOf(waypoints["waypoints"], nearestPoint2);
      let stationIdx3 = indexOf(waypoints["waypoints"], nearestPoint3);

      console.log(stationIdx);
      console.log(stationIdx3);

      let waypointsSlice2 = waypoints.waypoints.slice(stationIdx, stationIdx3);

      console.log(waypointsSlice2);
      // let distance2 = geolib.getDistance(
      //   waypointsSlice2[0],
      //   waypointsSlice2[waypointsSlice2.length - 1]
      // );
      let distanceToCover = geolib.getPathLength(waypointsSlice2);
      console.log(distanceToCover, station.name);

      //   let distanceCovered = nextStationTimetoArrive / timeToNextStation;

      let distanceCovered =
        1 - waypointsSlice2.length / waypoints.waypoints.length;

      let abc = Math.round(waypoints.waypoints.length * distanceCovered);
      let slice3 = waypoints.waypoints.slice(abc, stationIdx3);

      let newDistance = geolib.getPathLength(slice3);

      console.log(newDistance, distanceToCover);

      let metersBetweenWayPoints;

      let nextStation = allStations[stationName].nextStation;

      metersBetweenWayPoints = Math.round(newDistance / slice3.length);
      console.log(metersBetweenWayPoints);
      // console.log(waypointsSlice);
      // console.log(route);

      let ms2;
      if (timeToDestination) {
        let wpm = Math.round((timeToDestination * 60) / slice3.length);
        ms2 = toTime.fromSeconds(wpm).ms();
      }
      console.log(ms2);

      let ms3 = ms2 || 5000;

      return (
        <TrainContainer
          markers={slice3}
          color={hexcolor}
          fetchStationDepartures={props.fetchStationDepartures}
          interval={ms3}
          nextStation={nextStation}
          key={id}
          id={id}
        />
      );
    } else {
      return <div></div>;
    }
  }

  const prevStationName = allStations[stationName].previousStation;

  let prevStation;
  let timetoCurrentStation;
  let timeToDestination;
  if (prevStationName) {
    prevStation = allStations[prevStationName];
    console.log(prevStation, stationName);
    timetoCurrentStation = prevStation.timeToNextStation;

    timeToDestination = prevStation.timeToDestination;
    console.log(stationName, currentDeparture);
  }
  console.log(
    timetoCurrentStation,
    timeToDestination,
    stationName,
    currentDestinationName
  );
  console.log(
    currentDeparture,
    timetoCurrentStation,
    stationName,
    currentDestinationName
  );
  console.log(prevStationName, stationName);
  if (currentDeparture === "Leaving") {
    console.log("leaving", stationName);

    let distance;

    let stationLocation = allStations[stationName].location;
    let nextStation = allStations[stationName].nextStation;
    console.log(nextStation);

    //   distance = geolib.getDistance(
    //     allStations[stationName].location,
    //     currentDestination.location
    //   );

    //   console.log(distance, station.name);

    //   let nearestPoint = geolib.findNearest(
    //     allStations[stationName].location,
    //     waypoints.waypoints
    //   );
    //   let nearestPoint3;

    //   nearestPoint3 = geolib.findNearest(
    //     currentDestination.location,
    //     waypoints.waypoints
    //   );

    //   let stationIdx = indexOf(waypoints.waypoints, nearestPoint);
    //   // let stationIdx2 = indexOf(waypoints2.waypoints, nearestPoint2);
    //   let stationIdx3 = indexOf(waypoints.waypoints, nearestPoint3);

    //   let waypointsSlice = waypoints.waypoints.slice(
    //     stationIdx,
    //     stationIdx3 + 1
    //   );

    //   console.log(waypointsSlice);
    //   let metersBetweenWayPoints;

    //   metersBetweenWayPoints = Math.round(distance / waypointsSlice.length);

    //   console.log(metersBetweenWayPoints);

    //   let ms2;

    //   let wpm = Math.round((timeToDestination * 60) / waypointsSlice.length);
    //   ms2 = toTime.fromSeconds(wpm).ms();

    //   console.log(ms2);

    //   let ms3 = ms2 || 4000;
    // let train = {
    //   markers: waypointsSlice,
    //   color: route.hexcolor,
    //   interval: ms3,
    //   station: station
    // };
    // console.log(train);
    let ms3 = 20000;

    return (
      <TrainContainer
        markers={[stationLocation, stationLocation]}
        color={hexcolor}
        fetchStationDepartures={props.fetchStationDepartures}
        interval={1200000}
        nextStation={stationName}
        key={id}
      />
    );
  }

  if (departureID === 0) {
    let diff =
      Number(currentDeparture) -
      Number(prevStationDepartures[departureID].minutes) -
      Number(timetoCurrentStation);

    let diff2 =
      Number(currentDeparture) -
      Number(prevStationDepartures[departureID].minutes);

    console.log(diff, diff2, stationName, prevStationName);

    if (diff2 <= 0) {
      console.log("between two points");
      console.log(stationName, timetoCurrentStation, currentDeparture);
      let prevStationDeparture = prevStationDepartures[departureID];
      let prevStationETA = prevStationDeparture.minutes;
      console.log(prevStationDeparture, stationName);
      let nextStation = allStations[stationName].nextStation;
      console.log(prevStationETA, stationName);
      //   if (prevStationETA !== "Leaving") {
      let nearestPoint = geolib.findNearest(
        allStations[stationName].location,
        waypoints.waypoints
      );
      //   let nearestPoint2 = geolib.findNearest(
      //     nextStation.location,
      //     waypoints.waypoints
      //   );

      let nearestPoint3;
      // let nearestPoint2 = geolib.findNearest(
      //   nextStation.location,
      //   waypoints2.waypoints
      // );

      nearestPoint3 = geolib.findNearest(
        currentDestination.location,
        waypoints.waypoints
      );

      //   console.log(nearestPoint);
      //   console.log(nearestPoint2);
      let stationIdx = indexOf(waypoints["waypoints"], nearestPoint);
      //   let stationIdx2 = indexOf(waypoints["waypoints"], nearestPoint2);
      let stationIdx3 = indexOf(waypoints["waypoints"], nearestPoint3);

      console.log(stationIdx);
      console.log(stationIdx3);

      let waypointsSlice2 = waypoints.waypoints.slice(stationIdx, stationIdx3);

      console.log(waypointsSlice2);
      // let distance2 = geolib.getDistance(
      //   waypointsSlice2[0],
      //   waypointsSlice2[waypointsSlice2.length - 1]
      // );
      let distanceToCover = geolib.getPathLength(waypointsSlice2);
      console.log(distanceToCover, station.name);

      //   let distanceCovered = nextStationTimetoArrive / timeToNextStation;

      let distanceCovered =
        1 - waypointsSlice2.length / waypoints.waypoints.length;

      let abc = Math.round(waypoints.waypoints.length * distanceCovered);
      let slice3 = waypoints.waypoints.slice(abc, stationIdx3);

      let newDistance = geolib.getPathLength(slice3);

      console.log(newDistance, distanceToCover);

      let metersBetweenWayPoints;

      metersBetweenWayPoints = Math.round(newDistance / slice3.length);
      console.log(metersBetweenWayPoints);
      // console.log(waypointsSlice);
      // console.log(route);

      let ms2;
      if (timeToDestination) {
        let wpm = Math.round((timeToDestination * 60) / slice3.length);
        ms2 = toTime.fromSeconds(wpm).ms();
      }
      console.log(ms2);

      let ms3 = ms2 || 2000;

      return (
        <TrainContainer
          markers={slice3}
          color={hexcolor}
          fetchStationDepartures={props.fetchStationDepartures}
          interval={5000}
          nextStation={nextStation}
          key={id}
          id={id}
        />
      );
    }

    return <div></div>;
    // }}
  }
  return <div></div>;
  // if (Number(currentDeparture) === Number(timetoCurrentStation)) {
  //   console.log(stationName, prevStationDepartures);
  //   let prevStationDeparture = prevStationDepartures[departureID];
  //   let prevStationETA = prevStationDeparture.minutes;
  //   console.log(prevStationDeparture, stationName);
  //   console.log(prevStationETA, stationName);
  //   if (prevStationETA === "Leaving") {
  //     return;
  //   }
  //   if (Number(prevStationETA) > Number(currentDeparture)) {
  //     console.log(currentDeparture, prevStationETA, stationName);
  //     let nearestPoint = geolib.findNearest(
  //       prevStation.location,
  //       waypoints.waypoints
  //     );
  //     //   let nearestPoint2 = geolib.findNearest(
  //     //     nextStation.location,
  //     //     waypoints.waypoints
  //     //   );

  //     let nearestPoint3;
  //     // let nearestPoint2 = geolib.findNearest(
  //     //   nextStation.location,
  //     //   waypoints2.waypoints
  //     // );

  //     nearestPoint3 = geolib.findNearest(
  //       currentDestination.location,
  //       waypoints.waypoints
  //     );

  //     //   console.log(nearestPoint);
  //     //   console.log(nearestPoint2);
  //     let stationIdx = indexOf(waypoints["waypoints"], nearestPoint);
  //     //   let stationIdx2 = indexOf(waypoints["waypoints"], nearestPoint2);
  //     let stationIdx3 = indexOf(waypoints["waypoints"], nearestPoint3);

  //     console.log(stationIdx);
  //     console.log(stationIdx3);

  //     let waypointsSlice2 = waypoints.waypoints.slice(
  //       stationIdx,
  //       stationIdx3
  //     );

  //     console.log(waypointsSlice2);
  //     // let distance2 = geolib.getDistance(
  //     //   waypointsSlice2[0],
  //     //   waypointsSlice2[waypointsSlice2.length - 1]
  //     // );
  //     let distanceToCover = geolib.getPathLength(waypointsSlice2);
  //     console.log(distanceToCover, station.name);

  //     //   let distanceCovered = nextStationTimetoArrive / timeToNextStation;

  //     let distanceCovered =
  //       1 - waypointsSlice2.length / waypoints.waypoints.length;

  //     let abc = Math.round(waypoints.waypoints.length * distanceCovered);
  //     let slice3 = waypoints.waypoints.slice(abc, stationIdx3);

  //     let newDistance = geolib.getPathLength(slice3);

  //     console.log(newDistance, distanceToCover);

  //     let metersBetweenWayPoints;

  //     metersBetweenWayPoints = Math.round(newDistance / slice3.length);
  //     console.log(metersBetweenWayPoints);
  //     // console.log(waypointsSlice);
  //     // console.log(route);

  //     let ms2;
  //     if (timeToDestination) {
  //       let wpm = Math.round((timeToDestination * 60) / slice3.length);
  //       ms2 = toTime.fromSeconds(wpm).ms();
  //     }
  //     console.log(ms2);

  //     let ms3 = ms2 || 2000;

  //     return (
  //       <TrainContainer markers={slice3} color={hexcolor} interval={ms3} />
  //     );
  //   }
  // }
};

export default LiveTrain;
