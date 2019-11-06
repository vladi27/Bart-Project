import React, {
  Component,
  PureComponent,
  useState,
  useEffect,
  useLayoutEffect,
  memo,
  useMemo,
  useReducer,
  useCallback,
  useImperativeHandle
} from "react";
import L from "leaflet";
import * as util from "leaflet-geometryutil";

import { Marker, Polyline } from "react-leaflet";
import { divIcon } from "leaflet";
//import { useWorker } from "react-hooks-worker";

import { lineString, along, lineDistance, lineSlice, point } from "@turf/turf";
//const Worker = require("worker_threads");
const OPTIONS = { units: "kilometers" };
// const createWorker = () =>
//   new Worker("../../webworkers/slice.js", { preserveTypeModule: true });
// console.log(createWorker);
// 30.1 seconds, the .1 is to allow a buffer for the next set of cords to load
// I know it's not exact, but it's close :)
//const STEPS = 120001;

const NewMarker = React.memo(
  React.forwardRef((props, ref) => {
    // stationSlic {
    const markerRef = React.useRef();
    const minutesRef = React.useRef(null);
    const initialState = [];
    const renderRef = React.useRef(null);
    const currrentSliceRef = React.useRef();
    const startTime = React.useRef(null);
    //const animated = React.useRef(false);
    const animated = React.useRef(null);
    //const [animated, setAnimated] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const mapRef2 = React.useRef(null);
    const polyLineRef = React.useRef();
    const currentTime = React.useRef();
    const minutes = props.minutes;
    //const mapRef = props.getMap();
    console.log(mapRef);

    useEffect(() => {
      if (renderRef.current !== 1);
      {
        let mref = props.getMap();
        mapRef2.current = mref;
        console.log(mref);
        renderRef.current = 1;

        setMapRef(mref);
      }
    }, []);

    const routeStations = props.routeStations;
    const waypoints = routeStations[props.stationIndex - 1].slice;

    const totalTime = useMemo(() => {
      // if (!props.initialPos) {
      //   animated.current = null;
      // }
      const routeStations = props.routeStations;
      const waypoints = routeStations[props.stationIndex - 1].slice;
      const polyline = L.polyline(waypoints);
      const dest = routeStations[props.stationIndex].location;
      var lat = parseFloat(dest[0]),
        lng = parseFloat(dest[1]),
        point = { lat: lat, lng: lng };
      polyline.addLatLng(point);

      console.log(polyline);
      polyLineRef.current = polyline;

      // if (mapRef2.current) {
      //   console.log(mapRef2);
      //   mapRef2.current.current.leafletElement.fitBounds(polyline.getBounds());
      // }

      startTime.current = 0;

      console.log(currentTime);

      if (
        (props.initialPos && props.minutes !== "Leaving") ||
        !props.initialPos
      ) {
        currentTime.current = props.totalTime * 60 * 1000;
        animated.current = true;
      }

      return props.minutes;

      //return props.totalTime * 60 * 1000;
    }, [props.station]);

    useLayoutEffect(() => {
      if (!totalTime) {
        return;
      }
      if (totalTime !== props.minutes && animated.current) {
        console.log(props.minutes);
        animated.current = null;
        minutesRef.current = props.minutes;
      }
    }, [props.minutes]);

    useLayoutEffect(() => {
      const routeStations2 = props.routeStations;
      const waypoints2 = routeStations2[props.stationIndex - 1].slice;
      console.log(props.minutes, props.totalTime);
      if (minutesRef.current == null || animated.current) {
        return;
      }

      // if (
      //   props.totalTime &&
      //   Number(props.minutes) !== props.totalTime &&
      //   props.minutes === "Leaving" &&
      //   animated
      // ) {
      // }

      // if (
      //   totalTime !== props.minutes && animated.current
      //   animated.current == null
      // ) {
      // setAnimated(null);

      if (minutesRef.current === props.minutes) {
        const currentPoly = polyLineRef.current;
        console.log(currentPoly);
        const currentPosition = markerRef.current.leafletElement.getLatLng();

        console.log(
          currentPosition,
          currentPoly,
          props.station,
          props.minutes,
          waypoints2[0][waypoints2.length - 1]
        );
        const pos = waypoints2[waypoints2.length - 1];
        const pos2 = [parseFloat(pos[0]), parseFloat(pos[1])];
        const pos3 = L.latLng(pos2[0], pos2[1]);
        // const test = polyLineRef.current.getLatLngs();
        console.log(props.station, props.minutes, currentPosition, currentPoly);
        const ratio = util.locateOnLine(
          mapRef2.current.current.leafletElement,
          currentPoly,
          currentPosition
        );
        const newPolyline = util.extract(
          mapRef2.current.current.leafletElement,
          currentPoly,
          ratio,
          1
        );
        console.log(newPolyline);
        // const han = newPolyline.getLatLngs();
        currentPoly.setLatLngs(newPolyline);
        startTime.current = 0;
        if (props.minutes === "Leaving" && ratio < 1) {
          currentTime.current = 20000;
        } else if (props.minutes !== "Leaving") {
          currentTime.current = props.minutes * 60 * 1000;
        }
        animated.current = true;
      }
    }, [props.minutes]);

    // const [currentLocation, setCurrentLocation] = useState(null);
    // markerRef.current.leafletElement.setLatLng(locations[0]);
    //const clone = React.useRef(null);
    // clone.current = markerRef.current.leafletElement.options.position;
    let current;
    //let frameId = null;
    const styles = ` background-color: ${props.color}`;
    const iconTrain = divIcon({
      className: `custom-div-icon${props.color.slice(1)}`,
      html: `<div style="${styles}"></div><i class="fas fa-subway"></i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
    //const stationSlice = routeStations[index - 1].slice;
    //const leavingPos = stationSlice[stationSlice.length - 1];
    const STEPS = 60 * 1000;
    // const mapRef = props.getMap();
    // const locations = routeStations[index - 1].geoSlice;
    // const line = lineString(locations); // our array of lat/lngs
    // const distance = lineDistance(line, OPTIONS);
    const initialPos = { lat: 0, lng: 0 };
    // const speed = useMemo(() => {
    //   if (minutes === "Leaving") {
    //     // exit if no cords in array
    //     return;
    //   }
    //   return distance / (Number(minutes) * 60 * 1000);
    // }, [station]);
    //const sub = distance / stationSlice.length;

    // useEffect(() => {
    //   currrentSliceRef.current = props.currentSlice; // Write it to the ref
    // }, [props.currentSlice]);
    let slice = props.currentSlice;

    //const { result } = useWorker(createWorker, slice);
    //console.log(result);
    // const arc = useMemo(() => {
    //   // let startTime = 0;
    //   if (props.minutes === "Leaving") {
    //     // exit if no cords in array
    //     return;
    //   }
    //   let results = [];
    //   //const result = useWorker(createWorker, props.currentSlice);

    //   //let index = props.totalMinutes - Number(minutes);
    //   let distance = lineDistance(props.currentSlice, OPTIONS);

    //   for (let i = 0; i < distance; i += distance / STEPS) {
    //     let segment = along(props.currentSlice, i, OPTIONS);
    //     results.push(segment.geometry.coordinates);
    //   }
    //   let now = performance.now();
    //   startTime.current = now;
    //   //startTime.current = 0;
    //   setAnimated(true);
    //   return results;
    // }, [props.minutes]);
    // console.log(arc, props.minutes, props.station);

    useImperativeHandle(ref, () => ({
      update(t) {
        if (animated.current == null || mapRef == null) {
          return;
        }

        // if (animated)
        console.log(props.station, minutes);

        if (startTime.current === 0) {
          startTime.current = t;
        }
        const start = startTime.current;
        const totalTime = currentTime.current;
        //console.log(ref, timeStep, arc, markerRef.current.leafletElement);
        let runtime = t - start;

        const ratio = runtime / totalTime;
        const currentPoly = polyLineRef.current.getLatLngs();
        console.log(currentPoly, ratio, mapRef2.current);

        if (
          ratio === 1 &&
          minutesRef.current === "Leaving" &&
          animated.current
        ) {
          const pos = util.interpolateOnLine(
            mapRef2.current.current.leafletElement,
            currentPoly,
            ratio
          );
          console.log(pos);
          const { latLng } = pos;
          console.log(latLng);
          markerRef.current.leafletElement.setLatLng(latLng);
          animated.current = null;
          //setAnimated(null);
        } else if (ratio < 1 && animated.current) {
          const pos = util.interpolateOnLine(
            mapRef2.current.current.leafletElement,
            currentPoly,
            ratio
          );
          console.log(pos);
          const { latLng } = pos;
          console.log(latLng);
          markerRef.current.leafletElement.setLatLng(latLng);
        }

        // let timeStep = Math.round(runtime);
        // if (timeStep < 0) {
        //   timeStep = 0;
        // }
        // console.log(timeStep);

        // if (timeStep < STEPS) {
        //   const newPosition = arc[timeStep];
        //   console.log(newPosition, props.station, timeStep);
        //   const [lon, lag] = newPosition;
        //   //console.log(newPosition, startTime, arc, lon, lag, station);
        //   return markerRef.current.leafletElement.setLatLng([lag, lon]);
        // } else if (timeStep >= STEPS) {
        //   setAnimated(null);
        //   const newPosition2 = arc[arc.length - 1];
        //   const [lon2, lag2] = newPosition2;
        //   markerRef.current.leafletElement.setLatLng([lag2, lon2]);
        // }

        //   cons
        //   const newPosition = arc[timeStep] || arc[arc.length - 1];
        //   console.log(newPosition, props.station, timeStep);
        //   const [lon, lag] = newPosition;
        //   //console.log(newPosition, startTime, arc, lon, lag, station);
        //   markerRef.current.leafletElement.setLatLng([lag, lon]);
        // }
      }
    }));

    // const arc = useMemo(() => {
    //   if (minutes === "Leaving") {

    //     // exit if no cords in array
    //     return;
    //   }
    //   return waypoints;
    // }, [waypoints]);

    // console.log(
    //   routeStations,
    //   index,
    //   minutes,
    //   color,
    //   id,
    //   station,
    //   stationSlice,
    //   distance,
    //   speed
    // );

    //   if (!markerRef.current) {
    //     console.log(
    //       routeStations,
    //       index,
    //       minutes,
    //       color,
    //       id,
    //       station,
    //       stationSlice,
    //       distance,
    //       speed
    //     );
    //     let distanceCovered = Math.round(speed * STEPS);
    //     console.log(distanceCovered, sub);
    //     let idx = Math.round(distanceCovered / sub);
    //     console.log(idx);
    //     let slice = locations.slice(0, idx);
    //     if (slice.length === 0) {
    //       slice = locations.slice();
    //     }
    //     const line2 = lineString(slice); // our array of lat/lngs
    //     const distance2 = lineDistance(line2, OPTIONS);
    //     var start = 12.5;
    //     var stop = 25;
    //     console.log(speed, distanceCovered, slice);
    //     //var sliced = turf.lineSliceAlong(line, start, stop, { units: "miles" });
    //     for (let i = 0; i < distance2; i += distance2 / STEPS) {
    //       let segment = along(line2, i, OPTIONS);
    //       results.push(segment.geometry.coordinates);
    //     }
    //     return results;
    //   } else if (markerRef.current) {
    //     console.log(markerRef.current.leafletElement);
    //     const lon = markerRef.current.leafletElement._latlng.lng;
    //     const lat = markerRef.current.leafletElement._latlng.lat;
    //     const lastPostion = point([lon, lat]);
    //     const end = point(locations[locations.length - 1]);

    //     // const dis = lineDistance()
    //     // var line = turf.lineString([
    //     //   [-77.031669, 38.878605],
    //     //   [-77.029609, 38.881946],
    //     //   [-77.020339, 38.884084],
    //     //   [-77.025661, 38.885821],
    //     //   [-77.021884, 38.889563],
    //     //   [-77.019824, 38.892368]
    //     // ]);
    //     // var start = turf.point([-77.029609, 38.881946]);
    //     // var stop = turf.point([-77.021884, 38.889563]);

    //     let sliced = lineSlice(lastPostion, end, line);
    //     let distanceCovered = speed * STEPS;
    //     let idx = Math.round(distanceCovered / sub);
    //     console.log(lastPostion, end, sliced, distanceCovered, idx);
    //     let slice2 = sliced.geometry.coordinates.slice(0, idx);
    //     console.log(lastPostion, end, sliced, distanceCovered, idx, slice2);
    //     const line3 = lineString(slice2); // our array of lat/lngs
    //     const distance3 = lineDistance(line3, OPTIONS);
    //     for (let i = 0; i < distance3; i += distance3 / STEPS) {
    //       let segment = along(line3, i, OPTIONS);
    //       results.push(segment.geometry.coordinates);
    //     }
    //     return results;
    //   }
    // }, [minutes]);
    // // console.log(
    // //   routeStations,
    // //   index,
    // //   minutes,
    // //   color,
    // //   id,
    // //   station
    // //   // stationSlice
    // // );

    // //   //const STEPS = Number(minutes) * 60 * 1000;
    // //   let results = [];
    // //   // const STEPS = Number(minutes) * 1000 * 60;
    // //   const locations = routeStations[index - 1].geoSlice;
    // //   console.log(locations, minutes, station);
    // //   const line = lineString(locations); // our array of lat/lngs
    // //   const distance = lineDistance(line, OPTIONS);
    // //   console.log(line, distance);
    // //   for (let i = 0; i < distance; i += distance / STEPS) {
    // //     let segment = along(line, i, OPTIONS);
    // //     results.push(segment.geometry.coordinates);
    // //   }
    // //   return results;
    // // }, [station]);

    // // // const [activeVehicle, handleActiveVehicleUpdate] = useActiveVehicle();
    // // // const heading =
    // // // prevCoors != null ? GeoHelpers.computeHeading(prevCoors, coors) : 0;

    // useLayoutEffect(() => {
    //   console.log(arc);
    //   // let arc = [];
    //   let startTime = 0;
    //   if (!arc) {
    //     // exit if no cords in array
    //     return;
    //   }
    //   // const arc = waypoints;
    //   console.log(arc);

    //   //const STEPS = Number(minutes) * 60 * 1000;
    //   // const arc = useCallback(() => {
    //   //   console.log(
    //   //     routeStations,
    //   //     index,
    //   //     minutes,
    //   //     color,
    //   //     id,
    //   //     station,
    //   //     stationSlice
    //   //   );

    //   //   const STEPS = Number(minutes) * 60 * 1000;
    //   //   let results = [];
    //   //   // const STEPS = Number(minutes) * 1000 * 60;
    //   //   const locations = routeStations[index - 1].geoSlice;
    //   //   console.log(locations, minutes, station);
    //   //   const line = lineString(locations); // our array of lat/lngs
    //   //   const distance = lineDistance(line, OPTIONS);
    //   //   console.log(line, distance);
    //   //   for (let i = 0; i < distance; i += distance / STEPS) {
    //   //     let segment = along(line, i, OPTIONS);
    //   //     results.push(segment.geometry.coordinates);
    //   //   }
    //   //   return results;
    //   // }, [station]);
    //   // clone.current = markerRef.current.leafletElement.options.position;
    //   //console.log(current, minutes);

    //   // const line = lineString(locations); // our array of lat/lngs
    //   // const distance = lineDistance(line, OPTIONS);
    //   // console.log(line, distance);
    //   // for (let i = 0; i < distance; i += distance / STEPS) {
    //   //   let segment = along(line, i, OPTIONS);
    //   //   arc.push(segment.geometry.coordinates);
    //   // }
    //   // console.log(arc);
    //   const animate = timestamp => {
    //     if (startTime === 0) {
    //       startTime = timestamp;
    //     }
    //     const runtime = timestamp - startTime;
    //     const timeStep = Math.round(runtime);

    //     const newPosition = arc[timeStep] || arc[arc.length - 1];
    //     const [lon, lag] = newPosition;
    //     console.log(newPosition, startTime, arc, lon, lag, station);
    //     markerRef.current.leafletElement.setLatLng([lag, lon]);
    //     //setCurrentLocation(arc[timeStep] || arc[arc.length - 1]);
    //     console.log(
    //       arc[timeStep],
    //       startTime,
    //       // currentRef,
    //       timeStep,
    //       newPosition,
    //       STEPS,
    //       timeStep,
    //       station,
    //       arc
    //       // currentLocation
    //     );
    //     current = newPosition;
    //     // console.log(currentRef);
    //     console.log(current);
    //     if (timeStep <= STEPS) {
    //       requestAnimationFrame(t => animate(t));
    //       //   setTimeout(() => {
    //       //     window.requestAnimationFrame(animate);
    //       //   }, 1000 / 60);
    //       // }
    //     }
    //   };
    //   // function animate(timestamp) {
    //   //   console.log(arc);
    //   //   // const current = clone.current;
    //   //   // clone.current = markerRef;
    //   //   // animate function to set location
    //   //   const runtime = timestamp - startTime;
    //   //   const timeStep = Math.round(runtime);

    //   //   const newPosition = arc[timeStep] || arc[arc.length - 1];
    //   //   const [lon, lag] = newPosition;
    //   //   console.log(newPosition, startTime);
    //   //   markerRef.current.leafletElement.setLatLng([lag, lon]);
    //   //   //setCurrentLocation(arc[timeStep] || arc[arc.length - 1]);
    //   //   console.log(
    //   //     arc[timeStep],
    //   //     startTime,
    //   //     // currentRef,
    //   //     timeStep,
    //   //     newPosition,
    //   //     STEPS,
    //   //     timeStep,
    //   //     station,
    //   //     arc
    //   //     // currentLocation
    //   //   );
    //   //   current = newPosition;
    //   //   // console.log(currentRef);
    //   //   console.log(current);
    //   //   if (timeStep <= STEPS) {
    //   //     window.requestAnimationFrame(animate);
    //   //     //   setTimeout(() => {
    //   //     //     window.requestAnimationFrame(animate);
    //   //     //   }, 1000 / 60);
    //   //     // }
    //   //   }
    //   // }
    //   // cancelAnimationFrame(frameId);
    //   // const frameId = window.requestAnimationFrame(timeStamp => {
    //   //   startTime = timeStamp;
    //   //   console.log(startTime, station);
    //   //   animate(timeStamp);
    //   // });

    //   const frameId = requestAnimationFrame(t => animate(t));

    //   return () => {
    //     //startTime = 0;
    //     cancelAnimationFrame(frameId);
    //   };
    //   // setTimeout(() => {
    //   //   frameId = window.requestAnimationFrame(timeStamp => {
    //   //     startTime = timeStamp;
    //   //     console.log(startTime, station);
    //   //     animate(timeStamp);
    //   //   });
    //   // }, 1000 / 60);
    // }, [arc]);

    // console.log(station);

    // //   useEffect(() => {
    // //     if (prevCoors == null) return;

    // //     const [prevLat, prevLong] = prevCoors;
    // //     const [lat, long] = coors;
    // //     let animationStartTime;

    // //     const animateMarker = timestamp => {
    // //       if (animationStartTime == null) animationStartTime = timestamp;

    // //       const progress = (timestamp - animationStartTime) / 5000;

    // //       if (progress > 1) return;

    // //       const currLat = prevLat + (lat - prevLat) * progress;
    // //       const currLong = prevLong + (long - prevLong) * progress;

    // //       const position = new LatLng(currLat, currLong);

    // //       markerRef.current.leafletElement.setLatLng(position);

    // //       requestAnimationFrame(animateMarker);
    // //     };

    // //     const animationFrame = requestAnimationFrame(animateMarker);

    // //     // eslint-disable-next-line consistent-return
    // //     return () => cancelAnimationFrame(animationFrame);
    // //   }, [coors, prevCoors]);

    return (
      // <Polyline positions={waypoints} ref={polyLineRef}>
      <Marker
        icon={iconTrain}
        position={
          !markerRef.current
            ? props.initCoords
            : markerRef.current.leafletElement._latlng
        }
        key={props.id}
        // onClick={handleActiveVehicleUpdate(plate, coors)}
        ref={markerRef}
      ></Marker>
      // </Polyline>
    );
  })
);

export default NewMarker;

// position = {
//         !markerRef.current
//   ? leavingPos
//   : markerRef.current.leafletElement._latlng
//       }
