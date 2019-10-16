import { connect } from "react-redux";
import { getCompassDirection } from "geolib";
import TrainMarker from "./train_marker";
import getPosition from "../../selectors/train_marker_selector";

const mapStateToProps = (state, props) => {
  return {
    pos: getPosition(state, props)
  };
};

export default connect(
  mapStateToProps,
  null
)(TrainMarker);
