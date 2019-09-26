import { connect } from "react-redux";
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
  fetchStationDepartures
} from "../../actions/station_actions";
import { fetchSpaceStation } from "../../actions/space_station_actions";
import MainPage from "./main_page";

const mapStateToProps = state => {
  return {
    stations: Object.values(state.stations),

    nextStation: state.nextStation,
    route_info: state.route_info,

    allRoutes: state.routes,
    waypoints: state.waypoints,
    schedules: state.schedules,
    allStations: state.stations,
    routes: state.routes,
    etas: state.etas
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchStations: () => dispatch(fetchStations()),
    fetchRoutes: () => dispatch(fetchRoutes()),
    getCurrentEtas: () => dispatch(getCurrentEtas()),
    fetchStationDepartures: abbr => dispatch(fetchStationDepartures(abbr)),
    fetchRouteStations: id => dispatch(fetchRouteStations(id)),
    fetchRouteSchedules: id => dispatch(fetchRouteSchedules(id)),
    fetchRouteInfo: () => dispatch(fetchRouteInfo()),
    receiveWayPoints: data => dispatch(receiveWayPoints(data)),
    fetchSpaceStation: () => dispatch(fetchSpaceStation()),
    fetchInitialStationDataSouth: () =>
      dispatch(fetchInitialStationDataSouth()),
    fetchInitialStationDataNorth: () => dispatch(fetchInitialStationDataNorth())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);
