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
      interval: null
    };
    this.intervalId = null;
    //this.markerRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevProps, prevState, this.state, this.props);
    console.log(snapshot);
    console.count();

    if (
      this.props.minutes === "Leaving" &&
      prevProps.minutes &&
      prevProps.minutes !== this.props.minutes &&
      prevProps.station === this.props.station
    ) {
      clearInterval(this.intervalId);
      console.count();
      this.intervalId = null;
      return this.setState({
        minutes: this.props.minutes,
        markers: this.props.train.currentSlice.shift(),
        allMarkers: this.props.train.allMarkers,
        interval: this.props.train.interval
      });
    } else if (
      this.props.minutes !== "Leaving" &&
      this.props.train.currentSlice !== prevProps.train.currentSlice
    ) {
      clearInterval(this.intervalId);
      console.count();
      this.intervalId = null;
      console.count();
      this.setState({
        minutes: this.props.minutes,
        station: this.props.station,
        markers: this.props.currentSlice.shift(),
        allMarkers: this.props.currentSlice,

        interval: this.props.train.interval
      });
      this.intervalId = setInterval(() => {
        let markers2 = this.state.allMarkers;
        if (markers2.length > 0) {
          let markers3 = markers2.shift();
          console.log(markers3);

          return this.setState({ markers: markers3 });
          // } else if (markers2.length === 1) {
          //   console.log(markers2);
          //   return this.setState({ markers: markers2[0] });
          // }
        }
      }, this.state.interval);
    }

    // if (
    //   this.props.interval === 0 &&
    //   prevProps.minutes !== this.props.minutes &&
    //   this.props.minutes === "Leaving" &&
    //   prevProps.minutes !== null
    // ) {
    //   clearInterval(this.intervalId);
    //   // if (this.props.markers[0] !== this.state.markers)
    //   {
    //     console.count();
    //     return this.setState({
    //       markers: this.props.markers[0],
    //       minutes: this.props.minutes,
    //       allMarkers: []
    //     });
    //   }
    // }

    // // if (
    // //   this.props.minutes === "Leaving" &&
    // //   prevProps.minutes &&
    // //   this.state.minutes !== "Leaving"
    // // ) {
    // //   console.count();

    // //   // return this.setState({
    // //   //   markers: this.props.markers[0],
    // //   //   ratio: this.props.ratio,
    // //   //   station: this.props.station
    // //   // });
    // // }

    // if (
    //   prevProps.station !== this.props.station &&
    //   prevProps.station !== null
    // ) {
    //   console.count();
    //   clearInterval(this.intervalId);
    //   //clearInterval(this.intervalId);
    //   this.setState({
    //     allMarkers: this.props.markers,
    //     markers: this.props.markers.shift(),
    //     // ratio: this.props.ratio,
    //     station: this.props.station
    //   });
    //   this.intervalId = setInterval(() => {
    //     console.count();
    //     let markers2 = this.state.allMarkers;
    //     if (markers2.length > 1) {
    //       let markers3 = markers2.shift();
    //       console.log(markers3);

    //       return this.setState({ markers: markers3 });
    //     } else if (markers2.length === 1) {
    //       return this.setState({ markers: markers2[0] });
    //     }
    //   }, this.props.interval);
    // }

    // if (snapshot !== null) {
    //   if (this.intervalId !== null) console.count();
    //   this.setState({
    //     ratio: this.props.ratio,
    //     station: this.props.station
    //   });
    //   const idx = indexOf(this.props.markers, snapshot);
    //   let slice;
    //   if (idx > -1) {
    //     slice = this.props.markers.slice(idx, 20);
    //   } else {
    //     const nearest2 = geolib.findNearest(snapshot, this.props.markers);
    //     const idx2 = indexOf(this.props.markers, nearest2);
    //     slice = this.props.markers.slice(idx2, 20);
    //   }
    //   console.log(slice);

    // this.intervalId2 = setInterval(() => {
    //   console.log("abc");

    //   console.log(this.state, markers);
    //   console.count();
    //   if (slice.length > 0) {
    //     return this.setState({ markers: slice.shift() });
    //   } else {
    //     return;
    //   }
    // }, 1000);

    // if (this.props.markers.length === 0 && this.state.allMarkers !== null) {
    //   clearInterval(this.intervalId);
    //   console.count();

    //   // this.intervalId = setInterval(() => {
    //   //   console.log("abc");

    //   //   console.log(this.state, markers);
    //   //   console.count();
    //   //   // if (markers.length > 1) {
    //   //   //   let markers2 = markers.shift();
    //   //   //   this.setState({ markers: markers2 });
    //   //   // } else if (markers.length === 1) {
    //   //   //   this.setState({ markers: markers[0], flag: false });
    //   //   // }
    //   //   this.setState({ markers: this.props.markers.shift() });
    //   // }, 6000);
    // }

    // if (
    //   this.state.ratio !== this.props.ratio &&
    //   this.props.markers === this.state.allMarkers
    // ) {
    //   console.count();
    //   clearInterval(this.intervalId);

    //   console.log(prevState, prevProps);
    //   this.setState({
    //     markers: prevState.markers,
    //     ratio: this.props.ratio
    //   });
    //   const currentSliceIdx = indexOf(this.props.markers, prevState.markers);
    //   let currentSlice = this.props.markers.slice(currentSliceIdx);
    //   this.intervalId = setInterval(() => {
    //     console.log("abc");

    //     console.log(this.state, markers);
    //     console.count();
    //     if (currentSlice.length > 1) {
    //       let markers2 = currentSlice.shift();
    //       this.setState({ markers: markers2 });
    //     } else if (currentSlice.length === 1) {
    //       this.setState({ markers: currentSlice[0] });
    //     }
    //     //   this.setState({ markers: currentSlice.shift() });
    //     // },
    //   }, 2000);
    // } else if (
    //   this.state.ratio !== this.props.ratio &&
    //   this.props.markers !== this.state.allMarkers
    // ) {
    //   clearInterval(this.intervalId);
    //   this.setState({
    //     markers: this.props.markers.shift(),
    //     ratio: this.props.ratio
    //   });
    //   let currentSlice = this.props.markers.slice();
    //   this.intervalId = setInterval(() => {
    //     console.log("abc");

    //     console.log(this.state, markers);
    //     console.count();
    //     if (currentSlice.length > 1) {
    //       let markers2 = currentSlice.shift();
    //       this.setState({ markers: markers2 });
    //     } else if (currentSlice.length === 1) {
    //       this.setState({ markers: currentSlice[0] });
    //     }
    //     //   this.setState({ markers: currentSlice.shift() });
    //     // },
    //   }, 2000);
    // }
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

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   // Are we adding new items to the list?
  //   // Capture the scroll position so we can adjust scroll later.
  //   console.log(prevProps, this.props);
  //   if (this.state.station === null && prevState.station !== null) {
  //     console.count();
  //     // const position = this.markerRef.current.leafletElement.options.position;
  //     // clearInterval(this.intervalId2);
  //     //clearInterval(this.intervalId);
  //     //this.intervalId = null;

  //     // const idx = indexOf(this.props.markers, position);
  //     // let slice;
  //     // if (idx > -1) {
  //     //   slice = this.props.markers.slice(idx, 10);
  //     // } else {
  //     //   const nearest2 = geolib.findNearest(position, this.props.markers);
  //     //   const idx2 = indexOf(this.props.markers, nearest2);
  //     //   slice = this.props.markers.slice(idx2, 10);
  //     // }
  //     // console.log(slice);
  //     // this.markerRef.current.leafletElement.options.position = slice[0];
  //     // return slice;
  //     // if (position) {
  //     //   return position;
  //     // }
  //   }
  //   return null;
  // }

  componentDidMount() {
    const nextStation = this.props.nextStation;

    // const markers = this.state.allMarkers;
    const markers = this.props.markers;

    // this.setState(prev => {
    //   console.log(prev);

    //   return { markers: prev.markers };
    // });

    // this.setState({
    //   allMarkers: markers.slice(1),
    //   markers: markers.shift(),
    //   // ratio: this.props.ratio,
    //   station: this.props.station,
    //   minutes: this.props.minutes
    // });

    // console.log(this.props.station);
    console.count();

    // // const str = `str${id}`

    // console.log("trainmarker");

    // this.inteval = ()  if (markers.length > 0) {
    //     let markers2 = markers.shift();
    //     return this.setState({ markers: markers2 });
    //   } else if (markers.length === 0) {
    //     return;
    //   }
    // }, 1000);

    this.setState(() => {
      if (this.props.minutes === "Leaving") {
        return {
          station: this.props.station,
          minutes: this.props.minutes,
          // allMarkers: this.props.train.allMarkers,
          markers: this.props.train.currentSlice.shift()
        };
      } else {
        return {
          station: this.props.station,
          minutes: this.props.minutes,
          allMarkers: this.props.train.currentSlice,
          markers: this.props.train.currentSlice.shift(),
          interval: this.props.train.interval
        };
      }
    });

    if (this.props.minutes !== "Leaving") {
      console.log(this.state.interval);
      this.intervalId = setInterval(() => {
        console.count();
        let markers2 = this.state.allMarkers;
        if (markers2.length > 0) {
          let markers3 = markers2.shift();
          console.log(markers3);

          return this.setState({ markers: markers3 });
          // } else if (markers2.length === 1) {
          //   console.log(markers2);
          //   return this.setState({ markers: markers2[0] });
          // }
        }
      }, 1000);
    }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // Store prevId in state so we can compare when props change.
  //   // Clear out previously-loaded data (so we don't render stale stuff).
  //   // if (props.id !== state.prevId) {
  //   //   return {
  //   //     externalData: null,
  //   //     prevId: props.id,
  //   //   };
  //   // }
  //   // No state update necessary
  //   // return null;

  //   if (
  //     prevState.minutes &&
  //     prevState.minutes !== "Leaving" &&
  //     nextProps.minutes === "Leaving" &&
  //     prevState.allMarkers !== null
  //   ) {
  //     console.count();

  //     return { allMarkers: null };
  //   }
  //   return null;
  // }
  //   // if (
  //   //   prevState.id === null

  //   //   // prevState.markers.length > 0 &&
  //   //   // nextProps.markers[0] === prevState.allMarkers[0]
  //   // ) {
  //   //   console.count();

  //   //   return {
  //   //     id: nextProps.id
  //   //   };
  //   if (prevState.ratio !== nextProps.ratio) {
  //     console.count();
  //     return { ratio: null };
  //   }
  //   //   else if (
  //   //     prevState.id === nextProps.id &&
  //   //     nextProps.leaving &&
  //   //     nextProps.nextStationId &&
  //   //     !prevState.leaving
  //   //   ) {
  //   //     return { leaving: true };
  //   //   } else if (
  //   //     prevState.id === nextProps.id &&
  //   //     prevState.allMarkers.length === 1 &&
  //   //     nextProps.markers.length > 1
  //   //   ) {
  //   //     console.count();
  //   //     return { allMarkers: null };
  //   //   } else if (
  //   //     prevState.id !== null &&
  //   //     prevState.id !== nextProps.id &&
  //   //     prevState.allMarkers.length === 1
  //   //   ) {
  //   //     console.count();
  //   //     return { allMarkers: null };
  //   //   }
  //   //   console.log(nextProps, prevState);
  //   //   return null;
  //   // }
  //   return null;
  // }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    // clearInterval(this.intervalId2);
    //   clearInterval(this.interval3);
  }

  render() {
    const color = this.props.color;
    const id = this.props.id;

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
            ref={this.props.getOrCreateRef(id)}
            // time in ms that marker will take to reach its destination
            duration={this.state.interval}
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
    train: getPosition(state, props)
  };
};
const mdp = state => {
  return {};
};
const DebouncedTrain = debounceRender(TrainContainer);
export default connect(
  msp,
  mdp
)(DebouncedTrain);

// export default TrainContainer;
