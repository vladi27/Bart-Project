import { connect } from "react-redux";
import {
  fetchStations,
  fetchRouteInfo,
  receiveWayPoints,
  fetchRoutes,
  getCurrentEtas,
  fetchRouteStations,
  fetchRouteSchedules,
  fetchStationDepartures,
  createTrains,
  updateTrains,
  addTrains
} from "../../actions/station_actions";
import debounceRender from "react-debounce-render";

import MainPage from "./main_page";

const mapStateToProps = state => {
  return {
    routes: state.routes,
    waypoints: state.waypoints,
    allStations: state.stations
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchStations: () => dispatch(fetchStations()),
    fetchRoutes: () => dispatch(fetchRoutes()),
    getCurrentEtas: (routes, route) => dispatch(getCurrentEtas(routes, route)),
    fetchStationDepartures: abbr => dispatch(fetchStationDepartures(abbr)),
    fetchRouteStations: id => dispatch(fetchRouteStations(id)),
    fetchRouteSchedules: id => dispatch(fetchRouteSchedules(id)),

    receiveWayPoints: data => dispatch(receiveWayPoints(data)),

    createTrains: (route, etas) => dispatch(createTrains(route, etas)),
    updateTrains: route => dispatch(updateTrains(route)),
    addTrains: route => dispatch(addTrains(route))
  };
};

const DebouncedMain = debounceRender(MainPage);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DebouncedMain);
