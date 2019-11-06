import {
  RECEIVE_STATIONS,
  RECEIVE_CURRENT_ETAS,
  RECEIVE_STATION_ETA
} from "../actions/station_actions";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

const recentEtasReducer = (state = {}, action) => {
  Object.freeze(state);
  // let newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_CURRENT_ETAS:
      console.log(action.etas);
      const allEtas = action.etas.slice();
      const results = {};
      allEtas.forEach(ele => {
        let newEle = JSON.parse(JSON.stringify(ele));

        ele.etd.forEach((ele2, idx) => {
          let obj = {
            hexcolor: ele2.estimate[0].hexcolor,
            direction: ele2.estimate[0].direction
          };
          console.log(ele2, ele);
          let ele3 = Object.assign({}, ele2, obj);
          newEle["etd"][idx] = ele3;
          console.log(newEle);
          let ele5 = Object.assign({}, newEle);
          results[ele.abbr] = ele5;
        });
      });
      return merge({}, state, results);
    // case RECEIVE_STATION_ETA:
    //   const currentStation = state[action.abbr];

    //   currentStation.etd = action.eta[0].etd;
    //   const newStation = { [action.abbr]: currentStation };
    //   return merge({}, state, newStation);

    // return merge({}, state, action.etas);
    default:
      return state;
  }
};

export default recentEtasReducer;
