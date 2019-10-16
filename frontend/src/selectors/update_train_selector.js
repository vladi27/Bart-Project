import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import findIndex from "lodash/findIndex";
import { updateTrains } from "../actions/station_actions";
const getTrains = (state, props) => props.trains[props.routeNumber];

const getEtas = state => state.etas;

const getWaypoints = (state, props) =>
  state.waypoints[Number(props.routeNumber) - 1];

const getRouteStations = (state, props) =>
  state.routes[props.routeNumber].stations;

const getRoute = (state, props) => state.routes[props.routeNumber];

const updateTrainPositions = () => {
  return createSelector(
    [getTrains, getEtas, getRoute],
    (trains, etas, route) => {
      let stations = route.stations;
      if (route.number === "2") {
        stations = stations.slice(0, -3);
      } else {
        stations = stations.slice(0, -1);
      }
      let stationLength = stations.length - 1;
      const updatedTrains = [];
      console.log(trains);
      trains.map((train, idx) => {
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
        let index = findIndex(currentStationEstimates, function(o) {
          return o.abbreviation === trainDestination && o.hexcolor === hexcolor;
        });
        console.log(index);
        console.log(lastMinutes);
        let index2 = findIndex(nextStationEstimates, function(o) {
          return o.abbreviation === trainDestination && o.hexcolor === hexcolor;
        });
        if (index > -1) {
          console.log(train, idx);
          let currentMinutes =
            currentStationEstimates[index].estimate[0].minutes;
          let currentDirection =
            currentStationEstimates[index].estimate[0].direction;
          let currentHexcolor =
            currentStationEstimates[index].estimate[0].hexcolor;
          console.log(train, currentMinutes);

          if (currentMinutes === lastMinutes) {
            console.log(train);
            let updatedTrain = Object.assign({}, train);
            return updatedTrains.push(updatedTrain);
          } else if (
            lastMinutes === "Leaving" &&
            currentMinutes !== "Leaving"
          ) {
            console.log(train);
            let lastTrain = false;

            let index3 = findIndex(nextStationEstimates, function(o) {
              return (
                o.abbreviation === trainDestination && o.hexcolor === hexcolor
              );
            });

            console.log(index3, train, nextStationName, nextStationEstimates);

            if (index3 > -1) {
              if (train.stationIdx + 1 === stationLength) {
                lastTrain = true;
              }
              let newObj = {
                stationName: nextStationName,
                stationIdx: train.stationIdx + 1,
                minutes: nextStationEstimates[index3].estimate[0].minutes,
                departures: nextStationEstimates[index3].estimate[0],
                lastTrain,
                pos: stations[train.stationIdx + 1].location
              };

              let updatedTrain = Object.assign({}, train, newObj);
              console.log(updatedTrain);
              return updatedTrains.push(updatedTrain);
            }
          } else if (
            (currentMinutes === "Leaving" && !train.lastTrain) ||
            Number(currentMinutes) < Number(lastMinutes)
          ) {
            console.log(train);
            let updObj = {
              minutes: currentMinutes,
              departures: currentStationEstimates[index].estimate[0]
            };

            let updatedTrain = Object.assign({}, train, updObj);
            console.log(updatedTrain);
            return updatedTrains.push(updatedTrain);
          }
        } else if (index === -1 && lastMinutes === "Leaving") {
        }
        let index4 = findIndex(nextStationEstimates, function(o) {
          return o.abbreviation === trainDestination && o.hexcolor === hexcolor;
        });

        console.log(index4, train, nextStationName, nextStationEstimates);

        if (index4 > -1) {
          let lastTrain = false;
          if (train.stationIdx + 1 === stationLength) {
            lastTrain = true;
          }
          let newObj = {
            stationName: nextStationName,
            stationIdx: train.stationIdx + 1,
            minutes: nextStationEstimates[index4].estimate[0].minutes,
            departures: nextStationEstimates[index4].estimate[0],
            lastTrain,
            pos: stations[train.stationIdx + 1].location
          };

          let updatedTrain = Object.assign({}, train, newObj);
          console.log(updatedTrain);
          return updatedTrains.push(updatedTrain);
        }
        return train;
      });
      console.log(updatedTrains);
      return updatedTrains;
    }
  );
};
// )(
//   /*
//    * Re-reselect resolver function.
//    * Cache/call a new selector for each different "listId"
//    */
//   (state, props) => props.routeNumber + "route"
// );

export default updateTrainPositions;
