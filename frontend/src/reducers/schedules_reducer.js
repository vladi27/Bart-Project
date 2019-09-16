import {
  RECEIVE_STATIONS,
  RECEIVE_ROUTE_SCHEDULES
} from "../actions/station_actions";
import merge from "lodash/merge";
import moment from "moment";
const toTime = require("to-time");

const scheduleReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ROUTE_SCHEDULES:
      let newObj = action.schedules;

      let results = [];

      let routeId = action.id;
      let randomRouteIdx = Math.floor(action.schedules.train.length / 2);
      let randomRoute = action.schedules.train[randomRouteIdx];

      let trainRoute = randomRoute.stop;

      console.log(randomRoute);

      console.log(trainRoute);

      trainRoute.map((stop, idx) => {
        let newObj = {};
        // console.log(idx);

        let stationName = stop["@station"];
        newObj["stationName"] = stationName;
        if (trainRoute[idx + 1] !== undefined) {
          let nextStation = randomRoute.stop[idx + 1];

          let nextStationName = nextStation["@station"];
          newObj["nextStationName"] = nextStationName;
          let departureTime = stop["@origTime"];
          // console.log(departureTime);
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
            newObj["timeToNextStation"] = diff;
          }

          // console.log(diff);

          results.push(newObj);
        }
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

      return merge({}, state, { [action.id]: results });
    // return merge({}, state, action.schedules);

    default:
      return state;
  }
};

export default scheduleReducer;
