
              //   return (
              //     <LiveTrains
              //       trains={estimate}
              //       destination={currentDestination}
              //       route={currentRoute}
              //     />
              //   );

              //   console.log(estimate, routeNumber, estimate.destination);
              //   let estimateTime = estimate.minutes;

              //   if (
              //     Number(estimateTime) !== NaN &&
              //     Number(estimateTime) > threshold
              //   ) {
              //     console.log("notvalid");
              //     return;
              //   }
              //   console.log(estimateTime);

              //   if (previousStation && previousStation.trains) {
              //     let previousEstimates = previousStation.trains.map(train => {
              //       return train.estimate.map(ele => {
              //         if (ele.abbreviation === currentDestination) {
              //           return ele;
              //         }
              //       });
              //     });

              //     console.log(previousEstimates);
              //   }

              //   let routeToCover = currentRoute.slice(0, idx + 1).reverse();
              //   if (estimateTime === "Leaving") {
              //     console.log("leaving");

              //     let distance;

              //     distance = geolib.getDistance(
              //       station.location,
              //       currentDestination.location
              //     );

              //     console.log(distance, station.name);

              //     let nearestPoint = geolib.findNearest(
              //       station.location,
              //       waypoints2.waypoints
              //     );
              //     let nearestPoint3;

              //     nearestPoint3 = geolib.findNearest(
              //       currentDestination.location,
              //       waypoints2.waypoints
              //     );

              //     let stationIdx = indexOf(waypoints2.waypoints, nearestPoint);
              //     // let stationIdx2 = indexOf(waypoints2.waypoints, nearestPoint2);
              //     let stationIdx3 = indexOf(waypoints2.waypoints, nearestPoint3);

              //     let waypointsSlice = waypoints2.waypoints.slice(
              //       stationIdx,
              //       stationIdx3 + 1
              //     );

              //     console.log(waypointsSlice);
              //     let metersBetweenWayPoints;

              //     metersBetweenWayPoints = Math.round(
              //       distance / waypointsSlice.length
              //     );

              //     if (
              //       waypointsSlice.length === 2 &&
              //       currentDestinationName === "ANTC"
              //     ) {
              //       return;
              //     } else {
              //       console.log(metersBetweenWayPoints);
              //       count.push("1");
              //       console.log(count);
              //       let ms2;

              //       let wpm = Math.round(
              //         (timeToDestination * 60) / waypointsSlice.length
              //       );
              //       ms2 = toTime.fromSeconds(wpm).ms();

              //       console.log(ms2);

              //       let ms3 = ms2 || 4000;
              //       let train = {
              //         markers: waypointsSlice,
              //         color: route.hexcolor,
              //         interval: ms3,
              //         station: station
              //       };
              //       console.log(train);
              //       trains.push(train);
              //       return;
              //       //   return (
              //       //     <TrainContainer
              //       //       markers={waypointsSlice}
              //       //       color={route.hexcolor}
              //       //       interval={ms3}
              //       //     />
              //       //   );}}
              //     }
              //   } else if (Number(estimateTime) <= threshold) {
              //     console.log("between two points");
              //     let nearestPoint = geolib.findNearest(
              //       station.location,
              //       waypoints2.waypoints
              //     );
              //     let nearestPoint2 = geolib.findNearest(
              //       nextStation.location,
              //       waypoints2.waypoints
              //     );

              //     let nearestPoint3;
              //     // let nearestPoint2 = geolib.findNearest(
              //     //   nextStation.location,
              //     //   waypoints2.waypoints
              //     // );

              //     nearestPoint3 = geolib.findNearest(
              //       currentDestination.location,
              //       waypoints2.waypoints
              //     );

              //     //   console.log(nearestPoint);
              //     //   console.log(nearestPoint2);
              //     let stationIdx = indexOf(waypoints2["waypoints"], nearestPoint);
              //     let stationIdx2 = indexOf(
              //       waypoints2["waypoints"],
              //       nearestPoint2
              //     );
              //     let stationIdx3 = indexOf(
              //       waypoints2["waypoints"],
              //       nearestPoint3
              //     );

              //     console.log(stationIdx);
              //     console.log(stationIdx3);

              //     let waypointsSlice2 = waypoints2.waypoints.slice(
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
              //       1 - waypointsSlice2.length / waypoints2.waypoints.length;

              //     let abc = Math.round(
              //       waypoints2.waypoints.length * distanceCovered
              //     );
              //     let slice3 = waypoints2.waypoints.slice(abc, stationIdx3);

              //     let newDistance = geolib.getPathLength(slice3);

              //     console.log(newDistance, distanceToCover);

              //     let metersBetweenWayPoints;

              //     metersBetweenWayPoints = Math.round(
              //       newDistance / slice3.length
              //     );
              //     console.log(metersBetweenWayPoints);
              //     // console.log(waypointsSlice);
              //     // console.log(route);
              //     count.push("1");
              //     console.log(count);
              //     let ms2;
              //     if (timeToDestination) {
              //       let wpm = Math.round(
              //         (timeToDestination * 60) / slice3.length
              //       );
              //       ms2 = toTime.fromSeconds(wpm).ms();
              //     }
              //     console.log(ms2);

              //     let ms3 = ms2 || 2000;
              //     let train = {
              //       markers: slice3,
              //       color: route.hexcolor,
              //       interval: ms3,
              //       station: station
              //     };
              //     console.log(train);
              //     trains.push(train);
              //     return;
              // return (
              //   <TrainContainer
              //     markers={slice3}
              //     color={route.hexcolor}
              //     interval={ms3}
              //   />
              // );
              // } else if (Number(estimateTime) === threshold) {
              //   console.log("equal");
              // }

              //     if (
              //       Number(estimateTime) < Number(previousStationTimetoNext) &&
              //       idx !== 0
              //     ) {
              //       let previousEstimates = [];
              //       previousStation.trains.map(train => {
              //         console.log(train);
              //         console.log(currentDestinationName);
              //         if (train.abbreviation === currentDestinationName) {
              //           previousEstimates.push(train.estimate);
              //         }
              //       });

              //       let prevFlattened = flatten(previousEstimates);
              //       console.log(prevFlattened);

              //       console.log(
              //         estimate,
              //         prevFlattened[idx2],
              //         previousStationTimetoNext
              //       );

              //       console.log(station);

              //       let prevFlattened2 = prevFlattened[idx2];
              //       console.log(
              //         Number(prevFlattened2.minutes) > Number(estimateTime)
              //         // Number(prevFlattened2.minutes),
              //         // Number(estimateTime)
              //       );

              //       if (
              //         !prevFlattened2 ||
              //         (Number(prevFlattened2.minutes) > Number(estimateTime) &&
              //           prevFlattened2.platform === estimate.platform)
              //       ) {
              //         console.log("yes");
              //         //   let distance = geolib.getDistance(
              //         //     stationLocation,
              //         //     nextStationLocation
              //         //   );
              //         count.push("1");
              //         //   console.log(station.location);
              //         // let bool = ar.some(function (arr) {
              //         //     return arr.every(function (prop, index) {
              //         //         return val[index] === prop
              //         //     })
              //         // });
              //         let nearestPoint = geolib.findNearest(
              //           station.location,
              //           waypoints2.waypoints
              //         );
              //         let nearestPoint2 = geolib.findNearest(
              //           nextStation.location,
              //           waypoints2.waypoints
              //         );

              //         let nearestPoint3;
              //         // let nearestPoint2 = geolib.findNearest(
              //         //   nextStation.location,
              //         //   waypoints2.waypoints
              //         // );

              //         nearestPoint3 = geolib.findNearest(
              //           currentDestination.location,
              //           waypoints2.waypoints
              //         );

              //         //   console.log(nearestPoint);
              //         //   console.log(nearestPoint2);
              //         let stationIdx = indexOf(waypoints2["waypoints"], nearestPoint);
              //         let stationIdx2 = indexOf(
              //           waypoints2["waypoints"],
              //           nearestPoint2
              //         );
              //         let stationIdx3 = indexOf(
              //           waypoints2["waypoints"],
              //           nearestPoint3
              //         );

              //         console.log(stationIdx);
              //         console.log(stationIdx3);

              //         let waypointsSlice2 = waypoints2.waypoints.slice(
              //           stationIdx,
              //           stationIdx3
              //         );

              //         console.log(waypointsSlice2);
              //         let distance2 = geolib.getDistance(
              //           waypointsSlice2[0],
              //           waypointsSlice2[waypointsSlice2.length - 1]
              //         );
              //         let distanceToCover = geolib.getPathLength(waypointsSlice2);
              //         console.log(distanceToCover, station.name);

              //         //   let distanceCovered = nextStationTimetoArrive / timeToNextStation;

              //         let distanceCovered =
              //           1 - waypointsSlice2.length / waypoints2.waypoints.length;

              //         let abc = Math.round(
              //           waypoints2.waypoints.length * distanceCovered
              //         );
              //         let slice3 = waypoints2.waypoints.slice(abc, stationIdx3);

              //         let newDistance = geolib.getPathLength(slice3);

              //         console.log(newDistance, distanceToCover);

              //         let metersBetweenWayPoints;

              //         metersBetweenWayPoints = Math.round(
              //           newDistance / slice3.length
              //         );
              //         console.log(metersBetweenWayPoints);
              //         // console.log(waypointsSlice);
              //         // console.log(route);
              //         count.push("1");
              //         console.log(count);
              //         let ms2;
              //         if (timeToDestination) {
              //           let wpm = Math.round(
              //             (timeToDestination * 60) / slice3.length
              //           );
              //           ms2 = toTime.fromSeconds(wpm).ms();
              //         }
              //         console.log(ms2);

              // while (currentDepartures.length) {
        //   let closestDeparture = currentDepartures.shift();

        //   let closestDepartureTime = closestDeparture.minutes;
        //   console.log(closestDepartureTime, stationName);
        //   j++;
        //   if (closestDepartureTime === "Leaving") {
        //     console.log("leaving", stationName);
        //     k = idx2;

        //     return;
        //   }
        // }

        // if (providedDestination === currentDestination) {
        //   let nextStation = stationObj[station["currentName"]];
        //   //   console.log(nextStation);
        //   let timeBetweenTwoStations = nextStation.timeToNextStation;
        //   //   console.log(timeBetweenTwoStations);
        //   let tracker = 0;
        //   let flag = false;
        //   let closestDeparture = currentDepartures.shift();
        //   let closestDepartureTime = closestDeparture.minutes;
        //   let threshold = timeBetweenTwoStations;
        //   if (Number(closestDepartureTime) > Number(threshold)) {
        //     console.log("skip");
        //     station.departures = currentDepartures;
        //     route = route.slice(idx2 + 1);
        //     // console.log(route);
        //     // return;
        //   }
        // }

        // if (currentDestination === providedDestination) {
        //   let routeTotalLength = routeStations.length;
        //   currentDepartures.map((train, idx3) => {
        //     let threshold = timeBetweenTwoStations;
        //     let trainEta = train.minutes;
        //     console.log(train);
        //     console.log(threshold);
        //     if (Number(trainEta) > Number(threshold)) {
        //       console.log("skip");
        //       return;
        //     } else {
        //       console.log("start");
        //     }
        //   });
        // }

              //         let ms3 = ms2 || 2000;
              //         let train = {
              //           markers: slice3,
              //           color: route.hexcolor,
              //           interval: ms3,
              //           station: station
              //         };
              //         console.log(train);
              //         trains.push(train);
              //         return;
              //         // return (
              //         //   <TrainContainer
              //         //     markers={slice3}
              //         //     color={route.hexcolor}
              //         //     interval={ms3}
              //         //   />
              //         // );
              //     //       }
              //     //
              //   }
              // });
           
            // console.log(destination);
            // trains = station.departures;
            // closestTrains = trains.map(ele => ele.estimate);
            // let closesTrainsflattened = flatten(closestTrains);
            // closestTrain = closesTrainsflattened[0];
            // let timetoDepart = closestTrain.minutes;

            // if (timetoDepart === "Leaving") {
            //   console.log("leaving");

            //   console.log(station);
            //   console.log(destination);
            //   let distance;

            //   distance = geolib.getDistance(station.location, destination.location);

            //   console.log(distance, station.name);

            //   let nearestPoint = geolib.findNearest(
            //     station.location,
            //     waypoints2.waypoints
            //   );
            //   let nearestPoint3;

            //   nearestPoint3 = geolib.findNearest(
            //     destination.location,
            //     waypoints2.waypoints
            //   );

            //   let stationIdx = indexOf(waypoints2.waypoints, nearestPoint);
            //   // let stationIdx2 = indexOf(waypoints2.waypoints, nearestPoint2);
            //   let stationIdx3 = indexOf(waypoints2.waypoints, nearestPoint3);

            //   let waypointsSlice = waypoints2.waypoints.slice(
            //     stationIdx,
            //     stationIdx3 + 1
            //   );

            //   console.log(waypointsSlice);
            //   let metersBetweenWayPoints;

            //   metersBetweenWayPoints = Math.round(distance / waypointsSlice.length);

            //   count.push("1");
            //   console.log(count);
            //   let ms2;

            //   let wpm = Math.round(
            //     (timeToDestination * 60) / waypointsSlice.length
            //   );
            //   ms2 = toTime.fromSeconds(wpm).ms();

            //   console.log(ms2);

            //   let ms3 = ms2 || 4000;
            //   return (
            //     <TrainContainer
            //       markers={waypointsSlice}
            //       color={route.hexcolor}
            //       interval={ms3}
            //     />
            //   );
            // }

            // if (
            //   nextStation !== undefined &&
            //   nextStation.departures !== undefined &&
            //   routeDestination.includes(station.currentDestination) === false
            // ) {
            //   let closestTrainsdepartingNextStation = nextStation.departures.map(
            //     ele2 => ele2.estimate
            //   );
            //   let closestTraindepartingNextStationFlattened = flatten(
            //     closestTrainsdepartingNextStation
            //   );
            //   let nextStationClosestTrain =
            //     closestTraindepartingNextStationFlattened[0];
            //   let nextStationTimetoArrive = nextStationClosestTrain.minutes;
            //   console.log(
            //     station.name + "  currentStation",
            //     timetoDepart + "  nextDepartingTraind",
            //     nextStationTimetoArrive + " train arrives to the next stations",
            //     timeToNextStation + "  distance to the next station",
            //     idx
            //   );

            //   if (timeToNextStation > nextStationTimetoArrive) {
            //     console.log("in-between");
            //     let stationLocation = station.location;
            //     let nextStationLocation = nextStation.location;
            //     let destination = obj[station.currentDestination];
            //     let distance = geolib.getDistance(
            //       stationLocation,
            //       nextStationLocation
            //     );
            //     count.push("1");
            //     //   console.log(station.location);
            //     // let bool = ar.some(function (arr) {
            //     //     return arr.every(function (prop, index) {
            //     //         return val[index] === prop
            //     //     })
            //     // });
            //     let nearestPoint = geolib.findNearest(
            //       station.location,
            //       waypoints2.waypoints
            //     );
            //     let nearestPoint2 = geolib.findNearest(
            //       nextStation.location,
            //       waypoints2.waypoints
            //     );

            //     let nearestPoint3;
            //     // let nearestPoint2 = geolib.findNearest(
            //     //   nextStation.location,
            //     //   waypoints2.waypoints
            //     // );

            //     nearestPoint3 = geolib.findNearest(
            //       destination.location,
            //       waypoints2.waypoints
            //     );

            //     //   console.log(nearestPoint);
            //     //   console.log(nearestPoint2);
            //     let stationIdx = indexOf(waypoints2["waypoints"], nearestPoint);
            //     let stationIdx2 = indexOf(waypoints2["waypoints"], nearestPoint2);
            //     let stationIdx3 = indexOf(waypoints2["waypoints"], nearestPoint3);

            //     console.log(stationIdx);
            //     console.log(stationIdx3);

            //     let waypointsSlice2 = waypoints2.waypoints.slice(
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
            //       1 - waypointsSlice2.length / waypoints2.waypoints.length;

            //     let abc = Math.round(waypoints2.waypoints.length * distanceCovered);
            //     let slice3 = waypoints2.waypoints.slice(abc, stationIdx3);

            //     let newDistance = geolib.getPathLength(slice3);

            //     console.log(newDistance, distanceToCover);

            //     let metersBetweenWayPoints;

            //     metersBetweenWayPoints = Math.round(newDistance / slice3.length);
            //     console.log(metersBetweenWayPoints);
            //     // console.log(waypointsSlice);
            //     // console.log(route);
            //     count.push("1");
            //     console.log(count);
            //     let ms2;
            //     if (timeToDestination) {
            //       let wpm = Math.round((timeToDestination * 60) / slice3.length);
            //       ms2 = toTime.fromSeconds(wpm).ms();
            //     }
            //     console.log(ms2);

            //     let ms3 = ms2 || 2000;
            //     return (
            //       <TrainContainer
            //         markers={slice3}
            //         color={route.hexcolor}
            //         interval={ms3}
            //       />
            //     );
            //   }

            // if (
            //   nextStation !== undefined &&
            //   nextStation.departures === undefined &&
            //   routeDestination.includes(station.currentDestination)
            // ) {
            //   console.log("last station");
            //   let stationLocation = station.location;
            //   let nextStationLocation = nextStation.location;
            //   let destination = obj[station.currentDestination];
            //   let distance = geolib.getDistance(
            //     stationLocation,
            //     nextStationLocation
            //   );
            //   console.log(station.location);
            //   // let bool = ar.some(function (arr) {
            //   //     return arr.every(function (prop, index) {
            //   //         return val[index] === prop
            //   //     })
            //   // });
            //   let nearestPoint = geolib.findNearest(
            //     station.location,
            //     waypoints2.waypoints
            //   );
            //   // let nearestPoint2 = geolib.findNearest(
            //   //   nextStation.location,
            //   //   waypoints2.waypoints
            //   // );

            //   // // console.log(nearestPoint);
            //   // // console.log(nearestPoint2);
            //   // let stationIdx = indexOf(waypoints2["waypoints"], nearestPoint);
            //   // let stationIdx2 = indexOf(waypoints2["waypoints"], nearestPoint2);

            //   // // console.log(stationIdx);
            //   // // console.log(stationIdx2);
            //   // let waypointsSlice = waypoints2.waypoints.slice(
            //   //   stationIdx,
            //   //   stationIdx2 + 1
            //   // );

            //   // //

            //   // // console.log(waypoints);
            //   // // console.log(waypointsSlice);

            //   // // console.log(waypoints[0]);

            //   // let stationIdx5 = Math.round(waypointsSlice.length * 0.7);
            //   // // console.log(stationIdx5);
            //   // let slice2 = waypointsSlice.slice(stationIdx5);
            //   // // console.log(slice2);

            //   let nearestPoint3;
            //   // let nearestPoint2 = geolib.findNearest(
            //   //   nextStation.location,
            //   //   waypoints2.waypoints
            //   // );
            //   if (destination) {
            //     nearestPoint3 = geolib.findNearest(
            //       destination.location,
            //       waypoints2.waypoints
            //     );
            //   }

            //   // console.log(nearestPoint);
            //   // console.log(nearestPoint2);
            //   let stationIdx = indexOf(waypoints2.waypoints, nearestPoint);
            //   // let stationIdx2 = indexOf(waypoints2.waypoints, nearestPoint2);
            //   let stationIdx3 = indexOf(waypoints2.waypoints, nearestPoint3);
            //   let waypointsSlice = waypoints2.waypoints.slice(
            //     stationIdx,
            //     stationIdx3 + 1
            //   );

            //   let metersBetweenWayPoints;

            //   metersBetweenWayPoints = Math.round(
            //     distance / waypointsSlice.length
            //   );
            //   console.log(metersBetweenWayPoints);
            //   // console.log(waypointsSlice);
            //   // console.log(route);
            //   count.push("1");
            //   console.log(count);
            //   let wpm = Math.round(
            //     (timeToDestination * 60) / waypointsSlice.length
            //   );
            //   let ms2 = toTime.fromSeconds(wpm).ms();
            //   console.log(waypointsSlice);
            //   console.log(route);
            //   count.push("1");
            //   console.log(count);
            //   return (
            //     <TrainContainer
            //       markers={waypointsSlice}
            //       color={route.hexcolor}
            //       interval={ms2}
            //     />
            //   );
            // }
            //       //}
            //     }
            //   }
            //   console.log(trains);
            // });

            // console.log(count);
            // console.log(trains);
            // return trains.map(train => {
            //   return (
            //     <TrainContainer
            //       markers={train.markers}
            //       color={train.color}
            //       interval={train.interval}
            //     />
            //   );