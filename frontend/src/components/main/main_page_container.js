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
  fetchStationDepartures,
  createTrains,
  updateTrains
} from "../../actions/station_actions";
import { fetchSpaceStation } from "../../actions/space_station_actions";
import MainPage from "./main_page";

const mapStateToProps = state => {
  return {};
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
    createTrains: route => dispatch(createTrains(route)),
    updateTrains: route => dispatch(updateTrains(route)),
    fetchInitialStationDataSouth: () =>
      dispatch(fetchInitialStationDataSouth()),
    fetchInitialStationDataNorth: () => dispatch(fetchInitialStationDataNorth())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(MainPage);
