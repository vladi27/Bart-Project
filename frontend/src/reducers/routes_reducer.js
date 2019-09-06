import merge from "lodash/merge";
import {
  RECEIVE_ROUTES,
  RECEIVE_ROUTE_STATIONS
} from "../actions/station_actions";

const routesReducer = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ROUTES:
      const routes = action.routes;

      const newRoutes = {};
      const allKeys = Object.keys(routes);

      allKeys.forEach((ele, idx) => {
        let obj = routes[ele];
        let num = obj.number;
        let newObj = {};
        newObj["key"] = "routes";
        newObj["title"] = obj.name;
        newObj["id"] = idx;
        newObj["selected"] = false;
        newObj["number"] = obj.number;

        newRoutes[num] = Object.assign({}, newObj);
      });

      return merge({}, state, newRoutes);

    case RECEIVE_ROUTE_STATIONS:
      const num = action.stations.number;
      const route = state[num];
      const allStations = action.stations.config.station;

      route["stations"] = allStations;

      const updateRoute = { [route.number]: route };

      return merge({}, state, updateRoute);

    default:
      return state;
  }
};

export default routesReducer;
