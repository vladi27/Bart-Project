import {
  RECEIVE_STATIONS,
  RECEIVE_ROUTE_SCHEDULES
} from "../actions/station_actions";
import merge from "lodash/merge";
//import moment from "moment";
const toTime = require("to-time");

const ROUTELENGTH = {
  1: 28,
  2: 28,
  3: 19,
  4: 19,
  5: 20,
  6: 20,
  7: 23,
  8: 23,
  9: 11,
  10: 11,
  11: 18,
  12: 18,
  13: 2,
  14: 2,
  19: 2,
  20: 2
};

const scheduleReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ROUTE_SCHEDULES:
      let newObj = action.schedules;

      let results = [];
      let obj = {};

      let routeId = action.id;
      let randomRouteIdx = Math.floor(action.schedules.train.length / 2);
      let randomRoute = action.schedules.train[randomRouteIdx];
      let randomRoutes = action.schedules.train.slice(
        randomRouteIdx + 1,
        action.schedules.train.length
      );
      let routeLength = Number(ROUTELENGTH[routeId]);
      let routeToExplore = randomRoutes.filter(train => {
        return (
          train.stop.length === routeLength &&
          (train.stop[train.stop.length - 1]["@origTime"] !== undefined ||
            train.stop[train.stop.length - 2]["@origTime"] !== undefined)
        );
      });
      // console.log(routeLength);

      // console.log(routeToExplore);
      // console.log(routeToExplore[0]);

      let trainRoute = routeToExplore[0].stop;
      console.log(trainRoute.length);

      // console.log(randomRoute);

      // console.log(trainRoute);

      if (routeToExplore) {
        trainRoute.forEach((stop, idx) => {
          let newObj = {};
          // console.log(idx);

          let stationName = stop["@station"];

          let lastStop = trainRoute[trainRoute.length - 1];
          let origTime = lastStop["@origTime"];
          if (!origTime) {
            origTime = trainRoute[trainRoute.length - 2]["@origTime"];
          }
          let departureTime2 = stop["@origTime"];
          let dt3 = moment(departureTime2, ["h:mm A"]).format("HH:mm");
          let dt4 = moment(origTime, ["h:mm A"]).format("HH:mm");
          let arr3 = dt3.split(":");

          let arr4 = dt4.split(":");

          if (arr3.length === 2 && arr4.length === 2) {
            let mins3 = toTime
              .fromHours(arr3[0])
              .addMinutes(arr3[1])
              .minutes();
            let mins4 = toTime
              .fromHours(arr4[0])
              .addMinutes(arr4[1])
              .minutes();
            let diff2 = mins4 - mins3;
            console.log(diff2);
            if (diff2 !== 0) {
              newObj["timeToDestination"] = diff2;
              console.log(newObj);
            }
          }
          newObj["stationName"] = stationName;

          let previousStation = trainRoute[idx - 1];
          let nextStation = trainRoute[idx + 1];

          if (previousStation) {
            let previousStationName = previousStation["@station"];

            newObj["previousStationName"] = previousStationName;
          }
          let departureTime = stop["@origTime"];
          // console.log(departureTime);
          if (nextStation) {
            let nextStationName = nextStation["@station"];
            newObj["nextStationName"] = nextStationName;

            let nextStationDepartureTime = nextStation["@origTime"];
            let dt = moment(departureTime, ["h:mm A"]).format("HH:mm");
            let dt2 = moment(nextStationDepartureTime, ["h:mm A"]).format(
              "HH:mm"
            );
            let arr = dt.split(":");

            let arr2 = dt2.split(":");
            console.log(arr2);

            if (arr.length === 2 && arr2.length === 2) {
              let mins1 = toTime
                .fromHours(arr[0])
                .addMinutes(arr[1])
                .minutes();
              let mins2 = toTime
                .fromHours(arr2[0])
                .addMinutes(arr2[1])
                .minutes();
              let diff = mins2 - mins1;
              console.log(diff);
              newObj["timeToNextStation"] = diff;
            }
          }

          // console.log(newObj);
          obj[newObj.stationName] = newObj;
          results.push(newObj);
        });

        // action.schedules.train.map(train => {
        //   // let randomRouteIdx = Math.floor(train.length/2);

        //   let trainStops = train.stop;
        //   let lastStop = trainStops[trainStops.length - 1];
        //   let lastStationTime = lastStop["@origTime"];
        //   // console.log(lastStationTime);
        //   let dt = moment(lastStationTime, ["h:mm A"]).format("HH:mm");
        //   console.log(dt);
        //   var now = new Date();

        //   // var hh = now.getHours();
        //   // var mm = now.getMinutes();

        //   let value = now.toTimeString();
        //   console.log(value);

        //   if (dt > value) {
        //     return (obj["stations"] = trainStops);
        //   }
        // });

        let ghf = {
          [action.id]: {
            arr: results,
            obj: obj
          }
        };

        return merge({}, state, ghf);
      }
    // return merge({}, state, action.schedules);

    default:
      return state;
  }
};

export default scheduleReducer;
