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
  fetchRouteSchedules
} from "../../actions/station_actions";
import { fetchSpaceStation } from "../../actions/space_station_actions";
import MainPage from "./main_page";

const mapStateToProps = state => {
  return {
    stations: Object.values(state.stations),
    space_station: state.space_station,
    nextStation: state.nextStation,
    route_info: state.route_info,
    routes: Object.values(state.routes).sort((a, b) => (a.id > b.id ? 1 : -1)),
    allRoutes: state.routes,
    waypoints: state.waypoints
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchStations: () => dispatch(fetchStations()),
    fetchRoutes: () => dispatch(fetchRoutes()),
    getCurrentEtas: () => dispatch(getCurrentEtas()),
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
