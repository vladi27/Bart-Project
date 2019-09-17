import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component } from "react";
import { connect } from "react-redux";
import Station from "./stations";
import * as geolib from "geolib";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import L from "leaflet";
import { divIcon } from "leaflet";
import styled from "styled-components";
import { Train } from "styled-icons/material/Train";
// import iconTrain from "./map_icon";
import { DriftMarker } from "leaflet-drift-marker";
import "leaflet.awesome-markers";

class TrainContainer extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = { markers: this.props.markers[0] };
  }

  componentDidMount() {
    const markers = this.props.markers;
    this.interval = setInterval(() => {
      // updates position every 5 sec
      this.setState({ markers: markers.shift() });
    }, this.props.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const color = this.props.color;

    const pos = this.state.markers;
    const styles = ` background-color: ${color}`;

    const iconTrain = divIcon({
      className: `custom-div-icon${color.slice(1)}`,
      html: `<div style="${styles}"></div><i class="fas fa-subway"></i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    console.log(color);
    console.log(iconTrain);
    console.log(this.props.interval);

    if (pos) {
      return (
        <div>
          <DriftMarker
            // if position changes, marker will drift its way to new position
            position={pos}
            // time in ms that marker will take to reach its destination
            duration={2000}
            icon={iconTrain}
            // style={{ backgroundColor: `${color}` }}
          >
            {/* <Popup>Hi this is a popup</Popup>
        <Tooltip>Hi here is a tooltip</Tooltip> */}
          </DriftMarker>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
  // this.state = { stations: this.props.selectedRoute.stations || [] };
}

export default TrainContainer;
