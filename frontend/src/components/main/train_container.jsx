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
import NextStationsReducer from "../../reducers/next_station_reducer_nb";
const uuidv4 = require("uuid/v4");

class TrainContainer extends PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = { markers: [], id: null, flag: false };
    this.intervalId = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const markers = this.props.markers.slice();

    console.log(prevProps, prevState, markers, this.state);
    console.count();

    if (
      this.state.id !== null &&
      this.props.id === prevProps.id &&
      this.props.markers !== this.state.allMarkers
    ) {
      console.count();
      clearInterval(this.intervalId);
      console.log(prevState, prevProps);
      this.setState({
        allMarkers: this.props.markers,
        markers: markers.shift(),
        flag: true
      });
      this.intervalId = setInterval(() => {
        console.log("abc");

        console.log(this.state, markers);
        console.count();
        if (markers.length > 1) {
          let markers2 = markers.shift();
          this.setState({ markers: markers2 });
        } else if (markers.length === 1) {
          this.setState({ markers: markers[0], flag: false });
        }
      }, 5000);
      // } else if (
      //   this.state.id !== null &&
      //   this.state.id !== prevState.id &&
      //   this.state.allMarkers === null
      // ) {
      //   console.count();
      //   console.log(prevState, prevProps);
      //   this.setState({
      //     allMarkers: this.props.markers,
      //     markers: prevState.markers,
      //     flag: true
      //   });
      // } else if (
      //   this.state.leaving &&
      //   this.state.id === prevState.id &&
      //   !prevState.leaving
      // ) {
      //   console.count();
      //   this.setState({
      //     markers: this.props.markers.shift(),
      //     allMarkers: this.props.allMarkers,
      //     flag: true
      //   });
      // }

      // if (
      //   markers.length === this.state.allMarkers.length &&
      //   this.props.id === this.state.id
      // ) {
      //   console.count();
      //   this.setState({
      //     markers: markers.shift()
      //   });
      // } else if (this.props.id === this.state.id) {
      //   if (markers.length > 1) {
      //     this.setState({ markers: markers.shift() });
      //   } else if (markers.length === 1) {
      //     this.setState({ markers: markers[0] });
      //   }
      // }
    }
  }

  componentDidMount() {
    const nextStation = this.props.nextStation;

    // const markers = this.state.allMarkers;
    const markers = this.props.markers.slice();

    // this.setState(prev => {
    //   console.log(prev);

    //   return { markers: prev.markers };
    // });

    this.setState({
      allMarkers: markers,
      markers: this.props.markers.shift()
    });

    console.log(this.props.station);
    console.count();

    // const str = `str${id}`

    console.log("trainmarker");

    this.intervalId = setInterval(() => {
      console.log("abc");

      console.log(this.state, markers);
      console.count();
      if (markers.length > 1) {
        let markers2 = markers.shift();
        this.setState({ markers: markers2 });
      } else if (markers.length === 1) {
        this.setState({ markers: markers[0], flag: false });
      }
    }, 5000);

    // this.interval3 = setInterval(() => {
    //   // updates position every 5 sec
    //   this.props.fetchStationDepartures(nextStation);
    // }, 30000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    // if (props.id !== state.prevId) {
    //   return {
    //     externalData: null,
    //     prevId: props.id,
    //   };
    // }
    // No state update necessary
    // return null;

    if (
      prevState.id === null

      // prevState.markers.length > 0 &&
      // nextProps.markers[0] === prevState.allMarkers[0]
    ) {
      console.count();

      return {
        id: nextProps.id
      };
      // } else if (
      //   prevState.id === nextProps.id &&
      // ) {
      //   console.count();
      //   return { allMarkers: null };
      // }
    }
    //   else if (
    //     prevState.id === nextProps.id &&
    //     nextProps.leaving &&
    //     nextProps.nextStationId &&
    //     !prevState.leaving
    //   ) {
    //     return { leaving: true };
    //   } else if (
    //     prevState.id === nextProps.id &&
    //     prevState.allMarkers.length === 1 &&
    //     nextProps.markers.length > 1
    //   ) {
    //     console.count();
    //     return { allMarkers: null };
    //   } else if (
    //     prevState.id !== null &&
    //     prevState.id !== nextProps.id &&
    //     prevState.allMarkers.length === 1
    //   ) {
    //     console.count();
    //     return { allMarkers: null };
    //   }
    //   console.log(nextProps, prevState);
    //   return null;
    // }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    //   clearInterval(this.interval3);
  }

  render() {
    const color = this.props.color;
    const id = this.props.id + "train";

    console.log(pos);
    const styles = ` background-color: ${color}`;

    const iconTrain = divIcon({
      className: `custom-div-icon${color.slice(1)}`,
      html: `<div style="${styles}"></div><i class="fas fa-subway"></i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    console.log(color);
    console.log(iconTrain);
    console.log(this.props.markers, this.props.station);
    console.log(this.props.interval);
    console.log(this.state.markers);
    console.log(this.props.key);
    console.log(this.state);
    // console.log(this.props.id);
    // const id = uuidv4();

    // if (!this.state.markers) {
    //   return <div></div>;
    // } else {

    let pos = this.state.markers;

    // console.log(id);
    // if (!this.state.markers) {
    //   pos = this.props.markers[0];
    // }
    if (!pos) {
      return <div></div>;
    }
    return (
      <div>
        {pos.length > 0 ? (
          <DriftMarker
            // if position changes, marker will drift its way to new position
            position={pos}
            key={id}
            // time in ms that marker will take to reach its destination
            duration={5000}
            icon={iconTrain}
            // style={{ backgroundColor: `${color}` }}
          >
            {/* <Popup>Hi this is a popup</Popup>
        <Tooltip>Hi here is a tooltip</Tooltip> */}
          </DriftMarker>
        ) : (
          <div></div>
        )}
      </div>
    );
  }

  // this.state = { stations: this.props.selectedRoute.stations || [] };
}

// export default connect(
//   null,
//   null
// )(TrainContainer);

export default TrainContainer;
