import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component } from "react";
import Station from "./stations";

class AllStations extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    // this.state = { stations: this.props.selectedRoute.stations || [] };
    this.state = { routes: [] };
  }

  render() {
    const allStationsName = Object.values(this.props.allStations);

    return (
      <div>
        {allStationsName.map(station => {
          return (
            <Station
              station={station}
              fetchStationDepartures={this.props.fetchStationDepartures}
              key={station.abbr}
              name={station.abbr}
            />
          );
        })}
      </div>
    );
  }
}

export default AllStations;
