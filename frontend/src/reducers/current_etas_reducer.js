import {
  RECEIVE_STATIONS,
  RECEIVE_CURRENT_ETAS,
  RECEIVE_STATION_ETA
} from "../actions/station_actions";
import merge from "lodash/merge";

const recentEtasReducer = (state = {}, action) => {
  Object.freeze(state);
  // let newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_CURRENT_ETAS:
      const allEtas = action.etas;
      const results = {};
      allEtas.forEach(ele => {
        ele.etd.forEach((ele2, idx) => {
          let obj = {
            hexcolor: ele2.estimate[0].hexcolor,
            direction: ele2.estimate[0].direction
          };
          let ele3 = Object.assign({}, ele2, obj);
          ele.etd[idx] = ele3;
          console.log(ele);
          let ele5 = Object.assign({}, ele);
          results[ele.abbr] = ele5;
        });
      });
      return merge({}, state, results);
    case RECEIVE_STATION_ETA:
      const currentStation = state[action.abbr];

      currentStation.etd = action.eta[0].etd;
      const newStation = { [action.abbr]: currentStation };
      return merge({}, state, newStation);

    // return merge({}, state, action.etas);
    default:
      return state;
  }
};

export default recentEtasReducer;
