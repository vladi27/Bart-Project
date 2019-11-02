import { connect } from "react-redux";
import Route from "./route";
import * as geolib from "geolib";
import {
  fetchStations,
  fetchRouteInfo,
  fetchInitialStationDataSouth,
  fetchInitialStationDataNorth,
  receiveWayPoints,
  fetchRoutes,
  getCurrentEtas,
  fetchRouteStations,
  fetchRouteSchedules,
  fetchStationDepartures,
  createTrains,
  updateTrains,
  addTrains,
  removeTrains,
  removeTrain
} from "../../actions/station_actions";
import updateCurrentTrains from "../../selectors/train_selectors";
import combineTrainSelectors from "../../selectors/combine_train_selectors";
import updateTrainPositions from "../../selectors/update_train_selector";
import addNewTrains from "../../selectors/add_trains_selector";
import createInitialPosition from "../../selectors/train_initial_selector";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import debounceRender from "react-debounce-render";
const uuidv4 = require("uuid/v4");

const ROUTES = {
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

const mapStateToProps = (state, props) => {
  return {
    trains: createInitialPosition(state, props),
    // newTrains: addNewTrains(state, props),
    route: state.routes[props.routeNumber],
    waypoints: state.waypoints[Number(props.routeNumber) - 1],
    allStations: state.stations,
    etas: props.etas
    //initialEtas: props.etas,
    // allTrains: state.trains
  };
};

// const makeMapStateToProps = () => {
//   const getCombinedTrains = updateTrainPositions();
//   const mapStateToProps = (state, props) => {
//     return {
//       trains: getCombinedTrains(state, props),
//       route: state.routes[props.routeNumber],
//       waypoints: state.waypoints[Number(props.routeNumber) - 1],
//       allStations: state.stations,
//       allTrains: state.trains,
//       etas: state.etas
//     };
//   };
//   return mapStateToProps;
// };

const mdp = dispatch => {
  return {
    getCurrentEtas: (routes, route) => dispatch(getCurrentEtas(routes, route)),
    createTrains: (route, etas) => dispatch(createTrains(route, etas)),
    updateTrains: (route, etas, stations) =>
      dispatch(updateTrains(route, etas, stations)),
    addTrains: (route, trains, etas) =>
      dispatch(addTrains(route, trains, etas)),
    removeTrains: routeNum => dispatch(removeTrains(routeNum)),
    removeTrain: (routeNum, id) => dispatch(removeTrain(routeNum, id))
  };
};

const DebouncedRoute = debounceRender(Route);

export default connect(
  mapStateToProps,
  mdp
)(DebouncedRoute);

// export default connect(
//   mapStateToProps,
//   mdp
// )(Route);
