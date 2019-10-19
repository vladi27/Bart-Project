import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import React, { Component, PureComponent } from "react";
import { connect } from "react-redux";
import Station from "./stations";
import * as geolib from "geolib";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import uniqueId from "lodash/uniqueId";
import debounceRender from "react-debounce-render";
import { divIcon } from "leaflet";
import memoize from "memoize-one";
import styled from "styled-components";
import getPosition from "../../selectors/train_marker_selector";

// import iconTrain from "./map_icon";
import { DriftMarker } from "leaflet-drift-marker";

const uuidv4 = require("uuid/v4");

class TrainContainer extends PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      markers: null,
      id: null,
      allMarkers: [],
      station: null,
      interval: null,
      seconds: null,
      pos: null,
      start: null,
      currentSlice: [],
      total: null
    };
    this.intervalId = null;

    this.time = {
      start: performance.now()
    };
    this.ref = this.props.getOrCreateRef(this.props.id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevProps, prevState, this.state, this.props);
    console.log(snapshot);
    console.count();

    if (this.props.minutes !== this.state.minutes) {
      let station = this.props.routeStations[this.props.index].slice;
      console.count();
      this.setState({ minutes: this.props.minutes });
      // this.touched(this.props.pos, this.state.minutes, station);
    }
  }

  touched(now, slice) {
    console.log(slice, this.props.station);
    if (this.state.end) {
      console.log(slice, this.props.station);
      let newSlice = slice.slice();
      console.count();
      requestAnimationFrame(() => {
        this.time.elapsed = now - this.time.start;
        const progress = this.time.elapsed / this.state.end;
        const position = newSlice.shift();
        console.log(position);
        console.log(progress);
        // this.ref.current.leafletElement.options.position = position;
        this.setState({ markers: position });

        // console.log(
        //   this.ref.current.leafletElement.options.position,
        //   this.props.station
        // );
        console.log(now, newSlice);
        console.count();
        //  this.setState({ markers: station.shift() });
        // if (this.props.coinShortName == this.state.selectedPostId) {
        //   this.setState({ stateToDisplay: !this.state.stateToDisplay })
        // }

        if (progress < 1 && newSlice.length > 0) {
          let now2 = performance.now();
          console.log(newSlice);
          console.count();
          setTimeout(() => {
            this.touched(now2, newSlice);
          }, 2000);
        }
      });
    }
  }

  // const element = document.querySelector("span");
  // const finalPosition = 600;

  // const time = {
  //   start: performance.now(),
  //   total: 2000
  // };

  // const tick = now => {
  //   time.elapsed = now - time.start;
  //   const progress = time.elapsed / time.total;
  //   const position = progress * finalPosition;
  //   element.style.transform = `translate(${position}px)`;
  //   if (progress < 1) requestAnimationFrame(tick);
  // };

  // const time = {
  //   start: null,
  //   total: 2000
  // };

  // const tick = now => {
  //   if (!time.start) time.start = now;
  //   time.elapsed = now - time.start;
  //   if (time.elapsed < time.total) requestAnimationFrame(tick);
  // };

  // requestAnimationFrame(tick);

  componentDidMount() {
    const nextStation = this.props.nextStation;

    // const markers = this.state.allMarkers;
    const markers = this.props.markers;

    let end = null;
    let timeObject = new Date();
    console.log(timeObject);

    if (this.props.minutes !== "Leaving") {
      end = Number(this.props.minutes) * 60 * 1000;
    }

    // this.setState(prev => {
    //   console.log(prev);

    //   return { markers: prev.markers };
    // });

    this.setState({
      markers: this.props.initialCoordinates,
      // ratio: this.props.ratio,
      station: this.props.station,
      minutes: this.props.minutes,
      start: performance.now(),
      end: end,
      currentSlice: this.props.currentSlice
    });

    // const ref = this.props.getOrCreateRef(this.props.id);

    let now = performance.now();

    // this.touched(now, ref);

    console.log(
      this.props.currentSlice,
      this.props.station,
      this.props.minutes
    );

    setTimeout(() => {
      this.touched(now, this.state.currentSlice);
    }, 200);

    // console.log(this.props.station);
    console.count();
  }

  componentWillUnmount() {
    // clearInterval(this.intervalId);
    // clearInterval(this.intervalId2);
    //   clearInterval(this.interval3);
  }

  render() {
    const color = this.props.color;
    const id = this.props.id;
    const ref = this.props.getOrCreateRef(id);

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
    console.log(this.props.station, this.props);
    console.log(this.props.markers, this.props.station);
    console.log(this.props.interval);
    console.log(this.state.markers);
    console.log(this.props.key);
    console.log(this.ref);
    console.log(this.state);
    console.log(this.time.start, this.props.station);
    console.log(this.props.minutes, this.state.interval, this.props.station);
    // console.log(this.props.id);
    // const id = uuidv4();

    // if (!this.state.markers) {
    //   return <div></div>;
    // } else {

    let pos = this.state.markers;
    console.log(pos);

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
            ref={ref}
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

const msp = (state, props) => {
  return {
    currentSlice: getPosition(state, props)
  };
};
const mdp = state => {
  return {};
};
const DebouncedTrain = debounceRender(TrainContainer);
export default connect(
  msp,
  mdp
)(TrainContainer);

// export default TrainContainer;
