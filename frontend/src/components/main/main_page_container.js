import { connect } from "react-redux";
import {
  fetchRouteInfo,
  receiveWayPoints,
  fetchRoutes,
  getCurrentEtas,
  refetchCurrentEtas,
  fetchRouteStations,
  fetchRouteSchedules,
  createTrains,
  updateTrains,
  addTrains,
  removeTrains,
  removeTrain
} from "../../actions/station_actions";
import getCombinedState from "../../selectors/loading_selector";
import debounceRender from "react-debounce-render";
import createInitialPosition from "../../selectors/train_initial_selector";

import MainPage from "./main_page";

const mapStateToProps = state => {
  return {
    routes: state.routes,
    // trains: createInitialPosition(state),
    trains: state.trains,
    waypoints: state.waypoints,
    allStations: state.stations,
    etas: state.etas,
    loading: getCombinedState(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchRoutes: () => dispatch(fetchRoutes()),
    getCurrentEtas: (routes, route) => dispatch(getCurrentEtas(routes, route)),
    refetchCurrentEtas: (routes, route) =>
      dispatch(refetchCurrentEtas(routes, route)),

    fetchRouteStations: id => dispatch(fetchRouteStations(id)),
    fetchRouteSchedules: id => dispatch(fetchRouteSchedules(id)),
    removeTrains: routeNum => dispatch(removeTrains(routeNum)),
    removeTrain: id => dispatch(removeTrain(id)),
    receiveWayPoints: data => dispatch(receiveWayPoints(data)),

    createTrains: (route, etas) => dispatch(createTrains(route, etas)),
    updateTrains: (routeNum, etas, stations) =>
      dispatch(updateTrains(routeNum, etas, stations)),
    addTrains: route => dispatch(addTrains(route))
  };
};

const DebouncedMain = debounceRender(MainPage);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);
