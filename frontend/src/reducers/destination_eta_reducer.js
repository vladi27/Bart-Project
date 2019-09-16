import {
  RECEIVE_STATIONS,
  RECEIVE_CURRENT_ETAS
} from "../actions/station_actions";
import merge from "lodash/merge";

const destinationEtaReducer = (state = {}, action) => {
  Object.freeze(state);
  // let newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_CURRENT_ETAS:
      const allEtas = action.etas;
      const results = {};
      allEtas.map(ele => {
        return ele.etd.map(ele2 => {
          ele2["currentStation"] = ele.abbr;
          return (results[ele2.abbreviation] = ele2);
        });
      });
      return merge({}, state, results);

    // return merge({}, state, action.etas);
    default:
      return state;
  }
};

export default destinationEtaReducer;
