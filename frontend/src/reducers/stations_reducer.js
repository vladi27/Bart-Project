import { RECEIVE_STATIONS } from "../actions/station_actions";
import merge from "lodash/merge";

const StationsReducer = (state = {}, action) => {
  Object.freeze(state);
  // let newState = Object.assign({}, state)
  switch (action.type) {
    case RECEIVE_STATIONS:
      let newObj = {};
      action.stations.forEach(ele => {
        newObj[ele.abbr] = ele;
      });

      return merge({}, state, newObj);
    default:
      return state;
  }
};

export default StationsReducer;
