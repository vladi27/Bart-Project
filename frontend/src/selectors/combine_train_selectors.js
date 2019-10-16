import updateTrainPostions from "./update_train_selector";
import addNewTrains from "./add_trains_selector";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

const combineTrainSelectors = createCachedSelector(
  updateTrainPostions,
  addNewTrains,
  (updatedTrains, newTrains) => {
    console.log(updatedTrains, newTrains);
    const updTrains = updatedTrains.sort((a, b) =>
      a.stationIdx > b.stationIdx ? 1 : -1
    );

    const nTrains = newTrains.sort((a, b) =>
      a.stationIdx > b.stationIdx ? 1 : -1
    );

    const combinedTrains = nTrains.concat(updTrains);

    let trains3 = [];
    combinedTrains.map((ele, idx) => {
      if (idx === 0) {
        ele["firstTrain"] = true;
      } else {
        ele["firstTrain"] = false;
      }
      trains3.push(ele);
    });

    return trains3;
  }
)(
  /*
   * Re-reselect resolver function.
   * Cache/call a new selector for each different "listId"
   */
  (state, props) => props.routeNumber + "train"
);

export default combineTrainSelectors;
