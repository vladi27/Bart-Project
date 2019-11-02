import { Map, TileLayer, CircleMarker, Polyline, Marker } from "react-leaflet";
import React, { Component, PureComponent } from "react";
import { connect } from "react-redux";
import Station from "./stations";
import * as geolib from "geolib";
import merge from "lodash/merge";
import indexOf from "lodash/indexOf";
import findIndex from "lodash/findIndex";
import uniqueId from "lodash/uniqueId";
import debounceRender from "react-debounce-render";
import batchedUpdates from "./batched_updates";
import { divIcon } from "leaflet";
import memoize from "memoize-one";
import styled from "styled-components";
import NewMarker from "./marker";
import getPosition from "../../selectors/train_marker_selector";
import { lineString, along, lineDistance } from "@turf/turf";

// import iconTrain from "./map_icon";
import { DriftMarker } from "leaflet-drift-marker";
import { throws } from "assert";
const OPTIONS = { units: "kilometers" };
const STEPS = 30001;

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
      geoSlice: [],
      total: null,
      lastTrain: false,
      progress: null,
      totalMinutes: null
    };
    this.intervalId = null;

    this.time = {
      start: performance.now(),
      startTime: 0,
      end: false,
      duration: 2000,
      finished: 0,
      lastUpdate: 0
    };
    //this.touched = this.touched.bind(this);
    this.ref = React.createRef();
  }

  getOrCreateRef(element) {
    {
      this.cont = null;
      console.log(element);
      this.cont = element;
      const progress = this.cont;
      this.props.handleRefs(progress);
      //this.references[id] = this.cont;
    }
    //return this.references[id];
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log(prevProps, prevState, this.state, this.props);
  //   console.log(snapshot);
  //   console.count();

  //   const routeNum = this.props.routeNumber;
  //   const id = this.props.train.id;

  //   if (
  //     this.state.lastTrain &&
  //     prevState.currentSlice &&
  //     this.state.currentSlice &&
  //     this.state.currentSlice.length === 0 &&
  //     this.state.minutes === "1" &&
  //     this.state.markers.length > 0
  //   ) {
  //     window.cancelAnimationFrame(this.rafID);
  //     this.setState({ markers: [] });
  //     this.props.removeTrain(routeNum, id);
  //   }

  //   if (
  //     this.state.minutes === "Leaving" &&
  //     prevState.minutes === "Leaving" &&
  //     this.props.minutes === "Leaving" &&
  //     prevState.currentSlice.length > 0 &&
  //     this.state.currentSlice.length === 0
  //   ) {
  //     this.time.end = false;
  //     //window.cancelAnimationFrame(this.rafID);
  //   }

  //   if (
  //     this.props.minutes !== this.state.minutes &&
  //     this.state.minutes === "Leaving" &&
  //     prevProps.minutes === "Leaving" &&
  //     prevState.minutes === "Leaving" &&
  //     this.props.minutes !== "Leaving" &&
  //     this.state.station !== this.props.station
  //   ) {
  //     this.time.end = false;

  //     this.time.elapsed = 0;

  //     this.time["start"] = performance.now();
  //     let station = this.props.routeStations[
  //       this.props.index - 1
  //     ].slice.slice();
  //     let distance = this.props.routeStations[this.props.index - 1]
  //       .meterDistance;
  //     let timeStamp = performance.now();
  //     let destTimestamp = timeStamp + Number(this.props.minutes) * 60 * 1000;
  //     const interval = Math.round(
  //       (Number(this.props.minutes) * 60 * 1000) / station.length
  //     );
  //     const speed = geolib.getSpeed(
  //       {
  //         latitude: Number(station[0][0]),
  //         longitude: Number(station[0][1]),
  //         time: timeStamp
  //       },
  //       {
  //         latitude: Number(station[station.length - 1][0]),
  //         longitude: Number(station[station.length - 1][1]),
  //         time: destTimestamp
  //       }
  //     );
  //     const metersPerWaypoint = distance / station.length;
  //     console.log(
  //       this.props.minutes,
  //       this.state.minutes,
  //       this.props.station,
  //       this.state.station
  //     );
  //     console.count();
  //     return this.setState(
  //       {
  //         minutes: this.props.minutes,
  //         end: Number(this.props.minutes) * 60 * 1000,
  //         station: this.props.station,
  //         speed,
  //         metersPerWaypoint,
  //         lastTrain: this.props.train.lastTrain,
  //         interval: interval,
  //         currentSlice: station,
  //         progress: 0,
  //         totalMinutes: Number(this.props.minutes) * 60 * 1000
  //       },
  //       () => {
  //         this.time.end = true;
  //         let now = performance.now();
  //         // this.touched(now);
  //       }
  //     );

  //     // this.touched(now, ref);

  //     console.log(
  //       this.props.currentSlice,
  //       this.props.station,
  //       this.props.minutes
  //     );

  //     // // this.time["start"] = performance.now();
  //     // this.time["start"] = performance.now();
  //     // setTimeout(() => {
  //     //   let now = performance.now();
  //     //   this.touched(now);
  //     // }, this.state.interval);

  //     // let now = performance.now();
  //     // this.touched(now);

  //     // this.touched(this.props.pos, this.state.minutes, station);
  //   } else if (
  //     this.props.minutes !== this.state.minutes &&
  //     //   this.state.minutes !== "Leaving" &&
  //     this.props.minutes === "Leaving" &&
  //     this.state.station === this.props.station &&
  //     this.state.currentSlice.length > 0
  //   ) {
  //     console.log(this.props.minutes, this.state.minutes, this.props.station);
  //     console.count();
  //     let currentSlice3 = this.state.currentSlice.slice();
  //     console.log(currentSlice3, this.state);

  //     //this.time.end = false;
  //     let location = this.props.routeStations[this.props.index].location;
  //     this.setState({ minutes: "Leaving" });

  //     // let newSlice = this.props.currentSlice.currentSlice;
  //     // let newSlice2 = currentSlice3.concat([newSlice.shift()]);
  //     // console.log(newSlice2, this.state);
  //     // let currentInterval = this.state.interval;
  //     // let end = currentInterval * newSlice2.length;
  //     // let interval3 = Math.round((20 * 1000) / newSlice2.length);
  //     // if (interval3 < 900) {
  //     //   interval3 = 900;
  //     // }
  //     // console.log(interval3);
  //     // return this.setState(
  //     //   {
  //     //     minutes: this.props.minutes,
  //     //     end: end,
  //     //     currentSlice: newSlice2,
  //     //     progress: 0
  //     //     // interval: interval3
  //     //   },
  //     //   () => {
  //     //     this.time.elapsed = 0;
  //     //     this.time.end = true;
  //     //     this.time["start"] = performance.now();

  //     //     let now = performance.now();
  //     //     this.touched(now);
  //     //   }
  //     // );

  //     // } else {
  //     //   window.cancelAnimationFrame(this.rafID);
  //     //   return this.setState(prev => {
  //     //     console.log(this.state);
  //     //     return {
  //     //       minutes: this.props.minutes,
  //     //       // end: ,

  //     //       markers: this.props.currentSlice.currentSlice.shift()
  //     //       //currentSlice: this.props.currentSlice.currentSlice
  //     //     };
  //     //   });

  //     //window.cancelAnimationFrame(this.rafID);
  //     //this.time.start = null;
  //     // } else if (
  //     //   this.props.minutes !== this.state.minutes &&
  //     //   this.props.minutes === "1"
  //     // ) {
  //     //   window.cancelAnimationFrame(this.rafID);

  //     //   const interval = Math.round((60 * 1000) / this.state.currentSlice.length);
  //     //   console.log(
  //     //     this.props.minutes,
  //     //     this.state.minutes,
  //     //     this.props.station,
  //     //     this.state.station
  //     //   );
  //     //   console.count();
  //     //   this.setState(
  //     //     {
  //     //       minutes: this.props.minutes,
  //     //       end: 65000,

  //     //       interval: interval
  //     //     },
  //     //     () => {
  //     //       this.time.elapsed = null;
  //     //       this.time["start"] = performance.now();
  //     //       let now = performance.now();
  //     //       this.touched(now);
  //     //     }
  //     //   );

  //     //   // let diff =
  //     //   //   (Number(this.props.minutes) - Number(this.state.minutes)) * 1000 * 60;
  //     //   // let timeLeftToCover = this.time.end - this.time.elapsed;
  //     //   // console.log(
  //     //   //   diff,
  //     //   //   this.time.elapsed,
  //     //   //   this.state.station,
  //     //   //   this.props.minutes
  //     //   // );
  //     //   // waypoints per second = this.state.
  //     // }
  //     // } else if (
  //     //   this.state.minutes !== this.props.minutes &&
  //     //   prevProps.minutes === this.state.minutes &&
  //     //   this.state.minutes !== "Leaving" &&
  //     //   this.props.minutes !== "Leaving" &&
  //     //   Number(this.state.minutes) > Number(this.props.minutes) &&
  //     //   (Number(this.props.minutes) * 60 * 1000) / this.state.totalMinutes <
  //     //     this.state.progress &&
  //     //   this.state.currentSlice.length > 0
  //     // ) {
  //     //   this.time.end = false;
  //     //   let realProgress =
  //     //     (Number(this.props.minutes) * 60 * 1000) / this.state.totalMinutes;

  //     //   console.log(realProgress, this.state);

  //     //   // if (
  //     //   //   realProgress < this.state.progress &&
  //     //   //   this.state.currentSlice.length > 0
  //     //   // )

  //     //   {
  //     //     window.cancelAnimationFrame(this.rafID);

  //     //     const interval = Math.round(
  //     //       (Number(this.props.minutes) * (60 * 1000)) /
  //     //         this.state.currentSlice.length
  //     //     );
  //     //     console.log(
  //     //       this.props.minutes,
  //     //       this.state.minutes,
  //     //       this.props.station,
  //     //       this.state.station
  //     //     );
  //     //     console.count();
  //     //     return this.setState(
  //     //       {
  //     //         minutes: this.props.minutes,
  //     //         //  end: Number(this.props.minutes) * 60 * 1000 + 1000,

  //     //         interval: interval,
  //     //         progress: 0
  //     //       },
  //     //       () => {
  //     //         // this.time.elapsed = 0;
  //     //         // this.time["start"] = performance.now();

  //     //         let now = performance.now();
  //     //         this.time.end = true;
  //     //         this.touched(now);
  //     //       }
  //     //     );
  //     //   }
  //     // }
  //   } else if (
  //     this.props.minutes !== this.state.minutes &&
  //     this.state.minutes !== "Leaving" &&
  //     prevState.minutes !== "Leaving" &&
  //     this.props.minutes === "Leaving" &&
  //     this.state.station === this.props.station &&
  //     this.state.currentSlice.length === 0
  //   ) {
  //     // window.cancelAnimationFrame(this.rafID);

  //     this.time.end = false;
  //     return this.setState(prev => {
  //       console.log(this.state);
  //       return {
  //         minutes: this.props.minutes,
  //         // end: ,

  //         markers: this.props.currentSlice.currentSlice.shift()
  //         //currentSlice: this.props.currentSlice.currentSlice
  //       };
  //     });
  //   } else if (
  //     this.state.minutes !== this.props.minutes &&
  //     Number(this.state.minutes) > Number(this.props.minutes)
  //   ) {
  //     return this.setState({ minutes: this.props.minutes });
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.state.markers !== nextState.markers ||
  //     this.props.minutes !== nextProps.minutes
  //   );
  //   // );
  // }

  touched(now, locations) {
    console.log(this.state.currentSlice, this.props.station);
    console.log(this.time, this.props.station);
    // let currentMarker = this.state.markers;
    if (this.time.startTime === 0) {
      this.time.startTime = now;
    }

    const runtime = now - this.time.startTime;
    const timeStep = Math.round(runtime);
    const newPosition = locations[timeStep] || locations[locations.length - 1];
    const [lon, lag] = newPosition;
    this.ref.current.leafletElement.setLatLng([lag, lon]);
    // this.setState({ markers: [lag, lon] });
    console.log(
      this.ref,
      newPosition,
      locations,
      this.props.station,
      timeStep,
      locations
    );

    // console.count();
    // // this.rafID = requestAnimationFrame(() => {
    // let temp = this.time.elapsed;
    // let newSlice = this.state.currentSlice.slice();
    // // let currentMarker = this.state.markers.slice();
    // this.time.elapsed = now - this.time.start;
    // if (this.time.lastUpdate === 0) {
    //   this.time.lastUpdate = now;
    // }

    // console.log(this.time.start, this.props.station);
    // console.log(this.time.elapsed, this.props.station);
    // const elapsedSeconds = Math.round(this.time.elapsed / 1000);
    // let distanceCovered = elapsedSeconds * this.state.speed;
    // let index = Math.floor(distanceCovered / this.state.metersPerWaypoint);
    // const progress = this.time.elapsed / this.state.end;
    // let position = newSlice[index];
    // // let
    // // console.log(this.state.currentSlice, this.props.station);
    // console.log(position);
    // console.log(elapsedSeconds, distanceCovered, index, this.state);
    // //   console.log(progress, this.state.station, newSlice, this.state.minutes);
    // // this.ref.current.leafletElement.options.position = position;
    // // this.setState(prev => {
    // //   if (prev.markers !== position) {
    // //     return { markers: position };
    // //   }
    // // });

    // if (
    //   index < newSlice.length &&
    //   position !== this.state.markers &&
    //   position &&
    //   progress < 1
    // ) {
    //   let interval = this.time.elapsed - temp;
    //   // this.ref.current.leafletElement.setLatLng(position);
    //   let dist = geolib.getDistance(
    //     {
    //       latitude: Number(this.ref.current.leafletElement.options.position[0]),
    //       longitude: Number(this.ref.current.leafletElement.options.position[1])
    //     },
    //     {
    //       latitude: Number(position[0]),
    //       longitude: Number(position[1])
    //     }
    //   );
    //   let duration = Math.round((dist / this.state.speed) * 1000);
    //   console.log(duration, position, dist, this.state);
    //   this.time["duration"] = duration;
    //   this.time.finished = duration + now;
    //   // batchedUpdates(() => {
    //   //   this.setState({ markers: position, duration });
    //   // });
    //   // this.ref.current.leafletElement.options.duration = duration;
    //   console.log(this.ref.current.leafletElement);
    //   this.ref.current.leafletElement.setLatLng(position);
    // }
    // this.time.lastUpdate = now;

    if (timeStep <= STEPS) {
      // console.log(newSlice);
      // console.count();
      // let now2 = performance.now();
      // //this.touched(now2);
      //this.touched(t, locations);
      //   setTimeout(() => {
      window.requestAnimationFrame(t => {
        console.log(t, locations);
        this.touched(t, locations);
      });
    }
    //   },);
    // }
    // } else {
    //   window.cancelAnimationFrame(this.frameId);
    // }

    //   window.requestAnimationFrame(t => {
    //     console.log(t);
    //     this.touched(t, locations);
    //   });
    // }

    // console.log(
    //   this.ref.current.leafletElement.options.position,
    //   this.props.station
    // );
    // console.log(now, newSlice);
    console.count();
    //  this.setState({ markers: station.shift() });
    // if (this.props.coinShortName == this.state.selectedPostId) {
    //   this.setState({ stateToDisplay: !this.state.stateToDisplay })
    // }

    // if (
    //   progress >= 0.5 &&
    //   this.state.minutes !== "Leaving" &&
    //   this.state.currentSlice.length > 0
    // ) {
    //   this.time.end = false;
    //   //window.cancelAnimationFrame(this.rafID);
    //   this.handleMidPoint();
    // }

    // } else {
    //   this.setState({
    //     markers: this.state.currentSlice[this.state.currentSlice.length - 1]
    //   });
    //   //  window.cancelAnimationFrame(this.rafID);
    // }
    // });
  }

  handleMidPoint() {
    // const interval = Math.round(
    //   (Number(this.state.minutes) * (60 * 1000)) /
    //     this.state.currentSlice.length
    // );

    const end =
      Number(this.state.minutes * 60 * 1000) * this.state.currentSlice.length;
    return this.setState(
      {
        minutes: this.props.minutes,
        end: Number(this.state.minutes) * (60 * 1000),

        // interval: interval,
        end: end,
        progress: 0
      },
      () => {
        this.time.elapsed = 0;
        this.time["start"] = performance.now();

        let now = performance.now();
        this.time.end = true;
        this.touched(now);
      }
    );
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
    let speed;
    let metersPerWaypoint;
    let currentSlice;
    let distance;
    let timeObject = new Date();
    let geoSlice;
    console.log(timeObject);

    if (this.props.minutes !== "Leaving") {
      end = Number(this.props.minutes) * 60 * 1000;
      speed = this.props.currentSlice.speed;
      metersPerWaypoint = this.props.currentSlice.metersPerWaypoint;
      //currentSlice = this.props.currentSlice.currentSlice;
      distance = this.props.currentSlice.distance;
      geoSlice = this.props.currentSlice.geo;
    } else {
      //currentSlice = this.props.currentSlice;
    }

    // this.setState(prev => {
    //   console.log(prev);

    //   return { markers: prev.markers };
    // });

    console.log(this.props);

    const interval = this.props.interval;
    // this.ref.current.leafletElement.setLatLng(this.props.initialCoordinates);

    this.setState(
      {
        markers: this.props.initialCoordinates,
        // ratio: this.props.ratio,
        station: this.props.station,
        minutes: this.props.minutes,
        start: performance.now(),
        end: end,
        geoSlice,
        speed,
        distance,
        metersPerWaypoint,
        totalMinutes: end,
        duration: 1000,
        interval: this.props.interval,
        currentSlice: this.props.initialSlice,
        lastTrain: this.props.train.lastTrain
      },
      () => {
        console.log(this.ref);

        if (this.props.minutes !== "Leaving") {
          // let now = performance.now();
          // this.time.end = true;
          // console.count();
          //this.touched(now);
          // this.startLoop();
        }
      }
    );

    // /const ref = this.props.getOrCreateRef(this.props.id);

    // this.touched(now, ref);

    console.log(
      this.props.currentSlice,
      this.props.station,
      this.props.minutes
    );

    // if (this.props.minutes !== "Leaving") {
    //   setTimeout(() => {
    //     console.count();
    //     this.touched(now);
    //   }, this.props.interval);
    // }

    // console.log(this.props.station);
    console.count();
  }

  componentWillUnmount() {
    // clearInterval(this.intervalId);
    // clearInterval(this.intervalId2);
    //   clearInterval(this.interval3);
    window.cancelAnimationFrame(this.rafID);
  }

  startLoop() {
    if (!this._frameId) {
      this._frameId = window.requestAnimationFrame(t => {
        const speed = this.state.speed;
        const distanceCovered = 60 * speed;
        const index = Math.round(
          distanceCovered / this.state.metersPerWaypoint
        );

        let locations = [];

        const newSlice = this.state.geoSlice.slice(0, index);
        const line = lineString(newSlice);
        const distance = lineDistance(line, OPTIONS);

        for (let i = 0; i < distance; i += distance / STEPS) {
          let segment = along(line, i, OPTIONS);
          locations.push(segment.geometry.coordinates);
        }

        this.loop(t, locations);
      });
    }
  }

  loop(t, locations) {
    this.touched(t, locations);

    this.frameId = window.requestAnimationFrame(t => {
      const speed = this.state.speed;
      const distanceCovered = 60 * speed;
      const index = Math.round(distanceCovered / this.state.metersPerWaypoint);

      let locations = [];

      const newSlice = this.state.geoSlice.slice(0, index);
      const line = lineString(newSlice);
      const distance = lineDistance(line, OPTIONS);

      console.log(line);

      for (let i = 0; i < distance; i += distance / STEPS) {
        let segment = along(line, i, OPTIONS);
        //console.log(segment);
        locations.push(segment.geometry.coordinates);
      }

      this.loop(t, locations);
    });
  }

  render() {
    const color = this.props.color;
    const id = this.props.id;
    //  const ref = this.props.getOrCreateRef(id);

    console.log(pos);
    const styles = ` background-color: ${color}`;

    const iconTrain = divIcon({
      className: `custom-div-icon${color.slice(1)}`,
      html: `<div style="${styles}"></div><i class="fas fa-subway"></i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
    let duration = this.time.duration;

    const currentSlice = this.state.currentSlice;

    let newSlice;

    if (this.state.geoSlice) {
      const speed = this.state.speed;
      const distanceCovered = 30 * speed;
      const index = Math.round(distanceCovered / this.state.metersPerWaypoint);

      newSlice = this.state.geoSlice.slice();
      console.log(speed, index, newSlice);
    }
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
    console.log(
      this.state.minutes,
      this.state.interval,
      this.state.station,
      this.state.end,
      duration
    );
    console.log(this.time, this.state.station, this.state.minutes);
    console.log(newSlice, currentSlice);
    // console.log(this.props.id);
    // const id = uuidv4();

    // if (!this.state.markers) {
    //   return <div></div>;
    // } else {

    let pos = this.props.initialCoordinates || { lat: 0, lng: 0 };
    console.log(pos);

    // console.log(id);
    // if (!this.state.markers) {
    //   pos = this.props.markers[0];
    // }
    if (!newSlice || newSlice.length === 0) {
      return <div></div>;
    } else
      return (
        <NewMarker
          locations={newSlice}
          station={this.props.station}
          minutes={this.props.minutes}
          id={id}
          icon={iconTrain}
        ></NewMarker>
        //   <Marker
        //     // locations={newSlice}
        //     // minutes={this.props.minutes}
        //     // icon={iconTrain}
        //     // station={this.props.station}
        //     position={pos}
        //     // if position changes, marker will drift its way to new position
        //     // position={this.ref.current.leafletElement}
        //     key={id}
        //     ref={this.ref}
        //     // // ref={this.props.getOrCreateRef(id)}
        //     // // time in ms that marker will take to reach its destination
        //     // //duration={this.time.duration}
        //     icon={iconTrain}
        //     // style={{ backgroundColor: `${color}` }}
        //   >
        //     {/* <Popup>Hi this is a popup</Popup>
        // <Tooltip>Hi here is a tooltip</Tooltip> */}
        //   </Marker>
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
  mdp,
  null,
  { forwardRef: true }
)(TrainContainer);

// export default TrainContainer;
