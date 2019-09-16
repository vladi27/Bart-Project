import merge from "lodash/merge";
import {
  RECEIVE_ROUTES,
  RECEIVE_ROUTE_STATIONS,
  routes,
  RECEIVE_CURRENT_ETAS
} from "../actions/station_actions";

const ROUTE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const ROUTES = {
  1: {
    hexcolor: "#ffff33",
    destination: "Millbrae",
    abbreviation: "MLBR",
    direction: "South",
    color: "Yellow"
  },

  2: {
    hexcolor: "#ffff33",
    abbreviation: "ANTC",
    destination: "Antioch",
    direction: "North",
    color: "Yellow"
  },

  3: {
    hexcolor: "#ffff33",
    abbreviation: "RICH",
    destination: " Richmond",
    direction: "North",
    color: "Orange"
  },

  4: {
    hexcolor: "#ffff33",
    destination: "Warm Springs",
    abbreviation: "WARM",
    direction: "South",
    color: "Orange"
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "DALY",
    direction: "South",
    abbreviation: "DALY"
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Warm Springs",
    abbreviation: "WARM",
    abbreviation: "DALY",
    direction: "North"
  },

  7: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "South",

    destination: "Millbrae",
    abbreviation: "MLBR"
  },

  8: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "North",

    destination: "Richmond",
    abbreviation: "RCH"
  }
};

const routesReducer = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ROUTES:
      const routes = action.routes;

      const newRoutes = {};
      const allKeys = Object.keys(routes);

      allKeys.forEach((ele, idx) => {
        let obj = routes[ele];
        let num = obj.number;
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

      route["stations"] = allStations;

      const updateRoute = { [route.number]: route };

      return merge({}, state, updateRoute);
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
    //     let routeDestination = ROUTES[routeID].abbreviation;
    //     let newStations = [];
    //     route.stations = newStations;

    //     console.log(allStations);

    //     allStations.map(station => {
    //       let obj2 = {};
    //       console.log(station);
    //       const receivedStation = obj[station];

    //       if (receivedStation && receivedStation["etd"] !== undefined) {
    //         receivedStation.etd.map(destination => {
    //           if (destination.abbreviation === routeDestination) {
    //             newStations.push({ [station]: destination });
    //           } else {
    //             newStations.push(station);
    //           }
    //         });
    //       }
    //       // else {
    //       //   newStations.push(station);
    //       // }
    //     });
    //   });

    //   return merge({}, state, newRoutes2);

    default:
      return state;
  }
};

export default routesReducer;
