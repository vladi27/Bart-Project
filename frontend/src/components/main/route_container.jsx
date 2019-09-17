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
    console.log(this.props);
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
    console.log(this.state);
    const waypoints3 = this.state.waypoints;
    return waypoints3.map(ele => {
      return <Polyline positions={ele.waypoints} />;
    });
  }

  renderTrains() {
    const allStations = this.props.allStations;
    const waypoints2 = this.props.waypoints;
    const schedule = this.props.schedule;
    const route = this.props.route;
    const routeNumber = route.number;
    const routeDestination = routes[routeNumber].abbreviation;
    console.log(routeDestination);
    const count = [];

    const routeStations = route.stations;
    const newRouteStations = routeStations.map(ele => {
      let station2 = allStations[ele];
      return station2;
    });

    console.log(newRouteStations);

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

    console.log(stationEtds);

    const arr = [];
    stationEtds.forEach(ele => {
      console.log(ele);
      let obj = {};
      let allDepartures = ele.departures;
      if (allDepartures) {
        allDepartures.forEach(ele2 => {
          console.log(ele2);

          let dist = ele2.abbreviation;
          console.log(dist);
          console.log(routeDestination);
          let anc = [];

          console.log(routeDestination.includes(String(dist)));

          if (routeDestination.includes(String(dist))) {
            console.log("hi");
            anc.push(ele2);
            let trains = ele.trains || [];
            let newt = trains.concat(anc);
            console.log(newt);
            ele["trains"] = newt;
            ele["currentDestination"] = dist;
            let abcd = { [ele.name]: ele };
            obj = merge({}, abcd, ele);
          }
        });
      }
      let newe = merge({}, { [ele.name]: ele, obj });

      if (Object.values(obj).length === 0) {
        arr.push({ [ele.name]: ele });
      } else {
        arr.push(obj);
      }
      return arr;
    });

    if (arr) {
      newRouteStations.forEach((ele, idx) => {
        console.log(arr);
        let obj3 = arr[idx];
        let obj5 = obj3[[ele.abbr]];

        // let departures = arr[name];
        console.log(obj3);
        console.log(obj5);
        console.log(arr);
        if (obj5["trains"] !== undefined) {
          ele["departures"] = obj5["trains"];
        }
        let station2 = allStations[ele.abbr];
        let station2Lat = station2.gtfs_latitude;
        let station2Long = station2.gtfs_longitude;
        let arr2 = [station2Lat, station2Long];
        ele["location"] = arr2;
        ele["currentDestination"] = obj5["currentDestination"];
      });
    }

    console.log(newRouteStations);
    console.log(schedule);

    newRouteStations.forEach((ele, idx) => {
      let scheduleData = schedule[idx];
      if (scheduleData && scheduleData.timeToDestination) {
        ele["timeToDestination"] = scheduleData.timeToDestination;
      }

      if (scheduleData && scheduleData.timeToNextStation) {
        ele["timeToNextStation"] = scheduleData.timeToNextStation;
        ele["nextStation"] = scheduleData.nextStationName;
      }
    });

    // newRouteStations.forEach((ele, idx) => {
    //   let scheduleData = schedule[idx];

    //   if (scheduleData && scheduleData.timeToNextStation) {
    //     ele["timeToNextStation"] = scheduleData.timeToNextStation;
    //     ele["nextStation"] = scheduleData.nextStationName;
    //   }
    // });

    let obj = {};

    newRouteStations.forEach(ele => {
      obj[ele.abbr] = ele;
    });

    // console.log(newRouteStations);
    console.log(obj);

    if (Object.keys(obj).length > 0) {
      console.log(newRouteStations);
      return newRouteStations.map((station, idx) => {
        let timeToNextStation = station["timeToNextStation"];
        let timeToDestination = station["timeToDestination"];
        let nextStationName = station["nextStation"];
        let nextStation = {};
        console.log(station);

        nextStation = obj[nextStationName];

        let trains = {};
        let closestTrains = [];
        let closestTrain = {};
        let results = [];

        if (station.departures) {
          trains = station.departures;
          closestTrains = trains.map(ele => ele.estimate);
          let closesTrainsflattened = flatten(closestTrains);
          closestTrain = closesTrainsflattened[0];
          let timetoDepart = closestTrain.minutes;
          //   console.log("hi");
          //   console.log(nextStation);
          //   console.log(closestTrain);
          //   console.log(timetoDepart);

          if (timetoDepart === "Leaving") {
            console.log("leaving");
            let destination = obj[station.currentDestination];
            console.log(station);
            console.log(destination);
            let distance;

            if (destination) {
              distance = geolib.getDistance(
                station.location,
                destination.location
              );
            }

            console.log(distance, station.name);

            let nearestPoint = geolib.findNearest(
              station.location,
              waypoints2.waypoints
            );
            let nearestPoint3;
            // let nearestPoint2 = geolib.findNearest(
            //   nextStation.location,
            //   waypoints2.waypoints
            // );
            if (destination) {
              nearestPoint3 = geolib.findNearest(
                destination.location,
                waypoints2.waypoints
              );
            }
            //   let distance2 = geolib.getDistance(
            //       station.location,
            //       destination.location
            //   );
            //   71725 "San Francisco International Airport"

            // console.log(nearestPoint);
            // console.log(nearestPoint2);
            let stationIdx = indexOf(waypoints2.waypoints, nearestPoint);
            // let stationIdx2 = indexOf(waypoints2.waypoints, nearestPoint2);
            let stationIdx3 = indexOf(waypoints2.waypoints, nearestPoint3);

            let waypointsSlice = waypoints2.waypoints.slice(
              stationIdx,
              stationIdx3 + 1
            );
            // let distanceToCover = geolib.getPathLength(waypointsSlice);
            // console.log(distanceToCover, station.name);
            console.log(waypointsSlice);
            let metersBetweenWayPoints;
            if (waypointsSlice.length > 2) {
              metersBetweenWayPoints = Math.round(
                distance / waypointsSlice.length
              );
              console.log(metersBetweenWayPoints);
              // console.log(waypointsSlice);
              // console.log(route);
              count.push("1");
              console.log(count);
              let ms2;
              if (timeToDestination) {
                let wpm = Math.round(
                  (timeToDestination * 60) / waypointsSlice.length
                );
                ms2 = toTime.fromSeconds(wpm).ms();
              }
              console.log(ms2);

              let ms3 = ms2 || 4000;
              return (
                <TrainContainer
                  markers={waypointsSlice}
                  color={route.hexcolor}
                  interval={ms3}
                />
              );
            }
          }
          if (
            nextStation !== undefined &&
            nextStation.departures !== undefined
            // routeDestination.includes(station.currentDestination) === false
          ) {
            let closestTrainsdepartingNextStation = nextStation.departures.map(
              ele2 => ele2.estimate
            );
            let closestTraindepartingNextStationFlattened = flatten(
              closestTrainsdepartingNextStation
            );
            let nextStationClosestTrain =
              closestTraindepartingNextStationFlattened[0];
            let nextStationTimetoArrive = nextStationClosestTrain.minutes;
            console.log(
              station.name + "  currentStation",
              timetoDepart + "  nextDepartingTraind",
              nextStationTimetoArrive + " train arrives to the next stations",
              timeToNextStation + "  distance to the next station",
              idx
            );

            if (timeToNextStation > nextStationTimetoArrive) {
              console.log("in-between");
              let stationLocation = station.location;
              let nextStationLocation = nextStation.location;
              let destination = obj[station.currentDestination];
              let distance = geolib.getDistance(
                stationLocation,
                nextStationLocation
              );
              count.push("1");
              //   console.log(station.location);
              // let bool = ar.some(function (arr) {
              //     return arr.every(function (prop, index) {
              //         return val[index] === prop
              //     })
              // });
              let nearestPoint = geolib.findNearest(
                station.location,
                waypoints2.waypoints
              );
              let nearestPoint2 = geolib.findNearest(
                nextStation.location,
                waypoints2.waypoints
              );

              let nearestPoint3;
              // let nearestPoint2 = geolib.findNearest(
              //   nextStation.location,
              //   waypoints2.waypoints
              // );
              if (destination) {
                nearestPoint3 = geolib.findNearest(
                  destination.location,
                  waypoints2.waypoints
                );
              }

              //   console.log(nearestPoint);
              //   console.log(nearestPoint2);
              let stationIdx = indexOf(waypoints2["waypoints"], nearestPoint);
              let stationIdx2 = indexOf(waypoints2["waypoints"], nearestPoint2);
              let stationIdx3 = indexOf(waypoints2["waypoints"], nearestPoint3);

              console.log(stationIdx);
              console.log(stationIdx3);

              if (stationIdx && stationIdx3) {
                let waypointsSlice2 = waypoints2.waypoints.slice(
                  stationIdx,
                  stationIdx3
                );

                console.log(waypointsSlice2);
                // let distance2 = geolib.getDistance(
                //   waypointsSlice2[0],
                //   waypointsSlice2[waypointsSlice2.length - 1]
                // );
                let distanceToCover = geolib.getPathLength(waypointsSlice2);
                console.log(distanceToCover, station.name);

                //   let distanceCovered = nextStationTimetoArrive / timeToNextStation;

                let distanceCovered =
                  1 - waypointsSlice2.length / waypoints2.waypoints.length;

                let abc = Math.round(
                  waypoints2.waypoints.length * distanceCovered
                );
                let slice3 = waypoints2.waypoints.slice(abc, stationIdx3);

                let newDistance = geolib.getPathLength(slice3);

                console.log(newDistance, distanceToCover);

                let metersBetweenWayPoints;

                metersBetweenWayPoints = Math.round(
                  newDistance / slice3.length
                );
                console.log(metersBetweenWayPoints);
                // console.log(waypointsSlice);
                // console.log(route);
                count.push("1");
                console.log(count);
                let ms2;
                if (timeToDestination) {
                  let wpm = Math.round(
                    (timeToDestination * 60) / slice3.length
                  );
                  ms2 = toTime.fromSeconds(wpm).ms();
                }
                console.log(ms2);

                let ms3 = ms2 || 2000;
                return (
                  <TrainContainer
                    markers={slice3}
                    color={route.hexcolor}
                    interval={ms3}
                  />
                );
              }

              // console.log(waypoints);
              //   console.log(waypointsSlice);

              //   // console.log(waypoints[0]);
              //   console.log(distanceCovered);

              //   let stationIdx5 = Math.round(
              //     waypointsSlice.length * distanceCovered
              //   );
              //   //   console.log(stationIdx5);
              //   let slice2 = waypointsSlice.slice(stationIdx5);
              console.log(count);
              //   console.log(slice2);
              //   return <TrainContainer markers={slice2} color={route.hexcolor} />;
            }
            if (
              nextStation !== undefined &&
              nextStation.departures === undefined &&
              routeDestination.includes(station.currentDestination)
            ) {
              console.log("last station");
              let stationLocation = station.location;
              let nextStationLocation = nextStation.location;
              let destination = obj[station.currentDestination];
              let distance = geolib.getDistance(
                stationLocation,
                nextStationLocation
              );
              console.log(station.location);
              // let bool = ar.some(function (arr) {
              //     return arr.every(function (prop, index) {
              //         return val[index] === prop
              //     })
              // });
              let nearestPoint = geolib.findNearest(
                station.location,
                waypoints2.waypoints
              );
              // let nearestPoint2 = geolib.findNearest(
              //   nextStation.location,
              //   waypoints2.waypoints
              // );

              // // console.log(nearestPoint);
              // // console.log(nearestPoint2);
              // let stationIdx = indexOf(waypoints2["waypoints"], nearestPoint);
              // let stationIdx2 = indexOf(waypoints2["waypoints"], nearestPoint2);

              // // console.log(stationIdx);
              // // console.log(stationIdx2);
              // let waypointsSlice = waypoints2.waypoints.slice(
              //   stationIdx,
              //   stationIdx2 + 1
              // );

              // //

              // // console.log(waypoints);
              // // console.log(waypointsSlice);

              // // console.log(waypoints[0]);

              // let stationIdx5 = Math.round(waypointsSlice.length * 0.7);
              // // console.log(stationIdx5);
              // let slice2 = waypointsSlice.slice(stationIdx5);
              // // console.log(slice2);

              let nearestPoint3;
              // let nearestPoint2 = geolib.findNearest(
              //   nextStation.location,
              //   waypoints2.waypoints
              // );
              if (destination) {
                nearestPoint3 = geolib.findNearest(
                  destination.location,
                  waypoints2.waypoints
                );
              }

              // console.log(nearestPoint);
              // console.log(nearestPoint2);
              let stationIdx = indexOf(waypoints2.waypoints, nearestPoint);
              // let stationIdx2 = indexOf(waypoints2.waypoints, nearestPoint2);
              let stationIdx3 = indexOf(waypoints2.waypoints, nearestPoint3);
              let waypointsSlice = waypoints2.waypoints.slice(
                stationIdx,
                stationIdx3 + 1
              );

              let metersBetweenWayPoints;
              {
                metersBetweenWayPoints = Math.round(
                  distance / waypointsSlice.length
                );
                console.log(metersBetweenWayPoints);
                // console.log(waypointsSlice);
                // console.log(route);
                count.push("1");
                console.log(count);
                let wpm = Math.round(
                  (timeToDestination * 60) / waypointsSlice.length
                );
                let ms2 = toTime.fromSeconds(wpm).ms();
                console.log(waypointsSlice);
                console.log(route);
                count.push("1");
                console.log(count);
                return (
                  <TrainContainer
                    markers={waypointsSlice}
                    color={route.hexcolor}
                    interval={ms2}
                  />
                );
              }
            }
          }
        }
      });
    }
    console.log(count);
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
