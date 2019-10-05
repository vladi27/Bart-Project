import { combineReducers } from "redux";
import session from "./session_reducer";
import errors from "./errors_reducer";
import tweets from "./tweets_reducer";
import stations from "./stations_reducer";
import waypoints from "./waypoints_reducer";
import schedules from "./schedules_reducer";
import routes from "./routes_reducer";
import etas from "./current_etas_reducer";
import destinationEtas from "./destination_eta_reducer";
import next_station_sb from "./next_station_reducer_sb";
import prev_station_sb from "./prev_station_reducer_sb";
import next_station_nb from "./next_station_reducer_nb";
import prev_station_nb from "./prev_station_reducer_nb";
import space_station from "./space_station_reducer";
import route_info from "./route_info_reducer";

const RootReducer = combineReducers({
  errors,
  session,

  stations,
  routes,
  schedules,

  route_info,
  waypoints,
  etas
});

export default RootReducer;
