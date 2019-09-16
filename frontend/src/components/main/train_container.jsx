import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component } from "react";
import { connect } from "react-redux";
import Station from "./stations";
import * as geolib from "geolib";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import iconTrain from "./map_icon";
import { DriftMarker } from "leaflet-drift-marker";

class Train extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = { markers: this.props.markers[0] };
  }

  componentDidMount() {
    const markers = this.props.markers;
    setInterval(() => {
      // updates position every 5 sec
      this.setState({ markers: markers.shift() });
    }, 1200);
  }

  //   componentWillUnmount() {
  //     clearInterval(this.interval);
  //   }

  render() {
    console.log(this.state);
    let pos = this.state.markers || [];
    {
      return (
        <DriftMarker
          // if position changes, marker will drift its way to new position
          position={pos}
          // time in ms that marker will take to reach its destination
          duration={1000}
          icon={iconTrain}
        >
          {/* <Popup>Hi this is a popup</Popup>
        <Tooltip>Hi here is a tooltip</Tooltip> */}
        </DriftMarker>
      );
    }
  }
  // this.state = { stations: this.props.selectedRoute.stations || [] };
}

export default Train;
