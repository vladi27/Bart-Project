import {
  RECEIVE_STATIONS,
  RECEIVE_CURRENT_ETAS
} from "../actions/station_actions";
import merge from "lodash/merge";

const recentEtasReducer = (state = {}, action) => {
  Object.freeze(state);
  // let newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_CURRENT_ETAS:
      const allEtas = action.etas;
      const results = {};
      allEtas.map(ele => {
        results[ele.abbr] = ele;
      });
      return merge({}, state, results);

    // return merge({}, state, action.etas);
    default:
      return state;
  }
};

export default recentEtasReducer;
