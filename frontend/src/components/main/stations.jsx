import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component } from "react";

class Station extends Component {
  constructor(props) {
    super(props);

    // this.state = { stations: this.props.selectedRoute.stations || [] };
  }

  render() {
    const station = this.props.station;

    let station2Lat = parseFloat(station.gtfs_latitude);
    let station2Long = parseFloat(station.gtfs_longitude);
    let arr = [station2Lat, station2Long];
    return (
      <CircleMarker
        key={`marker-${station.abbr}`}
        center={arr}
        radius={10}
      ></CircleMarker>
    );
  }
}

export default Station;
