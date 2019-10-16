import { combineReducers } from "redux";
import session from "./session_reducer";
import errors from "./errors_reducer";

import stations from "./stations_reducer";
import waypoints from "./waypoints_reducer";
import schedules from "./schedules_reducer";
import routes from "./routes_reducer";
import trains from "./train_reducer";
import etas from "./current_etas_reducer";

const RootReducer = combineReducers({
  errors,
  session,

  stations,
  routes,

  trains,
  schedules,

  waypoints,
  etas
});

export default RootReducer;
