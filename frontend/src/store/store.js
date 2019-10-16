import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {
  updateTrains,
  createTrains,
  addTrains,
  buildWayPoints
} from "../actions/station_actions";

import rootReducer from "../reducers/root_reducer";

const persistenceActionTypes = [
  "ADD_TRAINS",
  "RECEIVE_CURRENT_ETAS",
  "RECEIVE_ROUTE_STATIONS"
];

const persistenceMiddleware = store => dispatch => action => {
  //const oldState = store.getState();

  const result = dispatch(action);

  if (persistenceActionTypes.includes(action.type)) {
    if (action.type === "RECEIVE_CURRENT_ETAS") {
      let newState = store.getState();
      handleTrains(action, store, newState);
    } else if (action.type === "RECEIVE_ROUTE_STATIONS") {
      let newState = store.getState();
      handleWaypoints(action, store, newState);
    }
  }
  return result;
};

const handleWaypoints = (action, store, newState) => {
  console.log(action);
  const routeNum2 = store.getState().routes[action.stations.number];
  const num3 = routeNum2.number;
  store.dispatch(buildWayPoints(num3));
};

const updateRoute = (action, store, newState) => {
  // const routeTrains = store.getState().trains[action.route.number];
  const routeStations = store.getState().routes[action.route.number].stations;
  const allEtas2 = store.getState().etas;
  const allTrains2 = store.getState().trains[action.route.number];

  let num = action.route.number;
  console.log(num);

  store.dispatch(updateTrains(num, allEtas2, routeStations));
};

const handleTrains = (action, store, newState) => {
  const routeIds = [1, 2, 3, 4, 5, 6, 7, 8];
  const allRoutes = store.getState().routes;
  const allEtas = store.getState().etas;
  console.log(allEtas);

  if (action.routes === "create") {
    let route = allRoutes[action.route];
    store.dispatch(createTrains(route, allEtas));
  } else if (action.routes === "update") {
    let stations = allRoutes[action.route].stations;
    store.dispatch(updateTrains(action.route, allEtas, stations));
  }
};

const configureStore = (preloadedState = {}) =>
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, logger, persistenceMiddleware)
  );

export default configureStore;
