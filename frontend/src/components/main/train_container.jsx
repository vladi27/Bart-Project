import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component, PureComponent } from "react";
import { connect } from "react-redux";
import Station from "./stations";
import * as geolib from "geolib";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import uniqueId from "lodash/uniqueId";

import { divIcon } from "leaflet";

import styled from "styled-components";

// import iconTrain from "./map_icon";
import { DriftMarker } from "leaflet-drift-marker";
import "leaflet.awesome-markers";

class TrainContainer extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = { markers: this.props.markers.shift() };
  }

  //   componentWillReceiveProps(nextProps) {
  //     // Any time props.defaultEmail changes, update state.
  //     if (nextProps.markers !== this.props.markers) {
  //       this.setState({ markers: nextProps.markers });
  //     }
  //   }

  componentDidMount() {
    const nextStation = this.props.nextStation;
    console.log(nextStation);
    const markers = this.props.markers;
    // this.setState({ markers: markers.shift() });
    const id = this.props.key;
    // const str = `str${id}`
    this.interval2 = setInterval(() => {
      // updates position every 5 sec
      this.setState({ markers: markers.shift() });
    }, this.props.interval);
    console.log("trainmarker");

    // this.interval3 = setInterval(() => {
    //   // updates position every 5 sec
    //   this.props.fetchStationDepartures(nextStation);
    // }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval2);
    //   clearInterval(this.interval3);
  }

  render() {
    const color = this.props.color;

    const id = this.props.id;
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
    console.log(this.state.markers);
    console.log(this.props.key);

    if (!pos) {
      return <div></div>;
    } else {
      return (
        <div>
          <DriftMarker
            // if position changes, marker will drift its way to new position
            position={pos}
            key={id}
            // time in ms that marker will take to reach its destination
            duration={1000}
            icon={iconTrain}
            // style={{ backgroundColor: `${color}` }}
          >
            {/* <Popup>Hi this is a popup</Popup>
        <Tooltip>Hi here is a tooltip</Tooltip> */}
          </DriftMarker>
        </div>
      );
    }
  }
  // this.state = { stations: this.props.selectedRoute.stations || [] };
}

// export default connect(
//   null,
//   null
// )(TrainContainer);

export default TrainContainer;
