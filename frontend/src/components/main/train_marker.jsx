import { Map, TileLayer, CircleMarker, Polyline, Marker } from "react-leaflet";
import React, { Component, PureComponent } from "react";
import iconTrain from "./map_icon";

class TrainMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { pos: [] };
  }

  componentDidMount() {
    this.setState({ pos: this.props.pos });
  }

  componentDidUpdate() {
    if (this.props.pos !== this.state.pos) {
      this.setState({ pos: this.props.pos });
    }
  }

  render() {
    console.log(this.props);
    if (!this.state.pos || this.state.pos.length === 0) {
      return null;
    }

    return (
      <Marker
        position={this.state.pos}
        key={this.props.id}
        icon={iconTrain}
      ></Marker>
    );
  }
}

export default TrainMarker;
