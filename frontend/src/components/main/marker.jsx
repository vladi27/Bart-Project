import React, {
  Component,
  PureComponent,
  useState,
  useEffect,
  useLayoutEffect,
  memo,
  useMemo,
  useReducer,
  useCallback
} from "react";

import { Marker } from "react-leaflet";
import { divIcon } from "leaflet";

import { lineString, along, lineDistance, lineSlice, point } from "@turf/turf";
const OPTIONS = { units: "kilometers" };
// 30.1 seconds, the .1 is to allow a buffer for the next set of cords to load
// I know it's not exact, but it's close :)
//const STEPS = 120001;

const NewMarker = React.memo(function NewMarker({
  routeStations,
  index,

  minutes,
  color,
  id,

  station
  // stationSlice
}) {
  const markerRef = React.useRef();
  const initialState = [];

  // const [currentLocation, setCurrentLocation] = useState(null);
  // markerRef.current.leafletElement.setLatLng(locations[0]);
  //const clone = React.useRef(null);
  // clone.current = markerRef.current.leafletElement.options.position;
  let current;
  //let frameId = null;
  const styles = ` background-color: ${color}`;
  const iconTrain = divIcon({
    className: `custom-div-icon${color.slice(1)}`,
    html: `<div style="${styles}"></div><i class="fas fa-subway"></i>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
  const stationSlice = routeStations[index - 1].slice;
  const leavingPos = stationSlice[stationSlice.length - 1];
  const STEPS = 30 * 1100;
  const locations = routeStations[index - 1].geoSlice;
  const line = lineString(locations); // our array of lat/lngs
  const distance = lineDistance(line, OPTIONS);
  const initialPos = { lat: 0, lng: 0 };
  const speed = useMemo(() => {
    if (minutes === "Leaving") {
      // exit if no cords in array
      return;
    }
    return distance / (Number(minutes) * 60 * 1000);
  }, [station]);
  const sub = distance / stationSlice.length;

  // const arc = useMemo(() => {
  //   if (minutes === "Leaving") {

  //     // exit if no cords in array
  //     return;
  //   }
  //   return waypoints;
  // }, [waypoints]);

  console.log(
    routeStations,
    index,
    minutes,
    color,
    id,
    station,
    stationSlice,
    distance,
    speed
  );
  const arc = useMemo(() => {
    // let startTime = 0;
    if (minutes === "Leaving") {
      // exit if no cords in array
      return;
    }

    let results = [];

    if (!markerRef.current) {
      console.log(
        routeStations,
        index,
        minutes,
        color,
        id,
        station,
        stationSlice,
        distance,
        speed
      );
      let distanceCovered = Math.round(speed * STEPS);
      console.log(distanceCovered, sub);
      let idx = Math.round(distanceCovered / sub);
      console.log(idx);
      let slice = locations.slice(0, idx);
      const line2 = lineString(slice); // our array of lat/lngs
      const distance2 = lineDistance(line2, OPTIONS);
      var start = 12.5;
      var stop = 25;
      console.log(speed, distanceCovered, slice);
      //var sliced = turf.lineSliceAlong(line, start, stop, { units: "miles" });
      for (let i = 0; i < distance2; i += distance2 / STEPS) {
        let segment = along(line2, i, OPTIONS);
        results.push(segment.geometry.coordinates);
      }
      return results;
    } else if (markerRef.current) {
      console.log(markerRef.current.leafletElement);
      const lon = markerRef.current.leafletElement._latlng.lng;
      const lat = markerRef.current.leafletElement._latlng.lat;
      const lastPostion = point([lon, lat]);
      const end = point(locations[locations.length - 1]);

      // const dis = lineDistance()
      // var line = turf.lineString([
      //   [-77.031669, 38.878605],
      //   [-77.029609, 38.881946],
      //   [-77.020339, 38.884084],
      //   [-77.025661, 38.885821],
      //   [-77.021884, 38.889563],
      //   [-77.019824, 38.892368]
      // ]);
      // var start = turf.point([-77.029609, 38.881946]);
      // var stop = turf.point([-77.021884, 38.889563]);

      let sliced = lineSlice(lastPostion, end, line);
      let distanceCovered = speed * STEPS;
      let idx = Math.round(distanceCovered / sub);
      console.log(lastPostion, end, sliced, distanceCovered, idx);
      let slice2 = sliced.geometry.coordinates.slice(0, idx);
      console.log(lastPostion, end, sliced, distanceCovered, idx, slice2);
      const line3 = lineString(slice2); // our array of lat/lngs
      const distance3 = lineDistance(line3, OPTIONS);
      for (let i = 0; i < distance3; i += distance3 / STEPS) {
        let segment = along(line3, i, OPTIONS);
        results.push(segment.geometry.coordinates);
      }
      return results;
    }
  }, [minutes]);
  // console.log(
  //   routeStations,
  //   index,
  //   minutes,
  //   color,
  //   id,
  //   station
  //   // stationSlice
  // );

  //   //const STEPS = Number(minutes) * 60 * 1000;
  //   let results = [];
  //   // const STEPS = Number(minutes) * 1000 * 60;
  //   const locations = routeStations[index - 1].geoSlice;
  //   console.log(locations, minutes, station);
  //   const line = lineString(locations); // our array of lat/lngs
  //   const distance = lineDistance(line, OPTIONS);
  //   console.log(line, distance);
  //   for (let i = 0; i < distance; i += distance / STEPS) {
  //     let segment = along(line, i, OPTIONS);
  //     results.push(segment.geometry.coordinates);
  //   }
  //   return results;
  // }, [station]);

  // // const [activeVehicle, handleActiveVehicleUpdate] = useActiveVehicle();
  // // const heading =
  // // prevCoors != null ? GeoHelpers.computeHeading(prevCoors, coors) : 0;

  useLayoutEffect(() => {
    console.log(arc);
    // let arc = [];
    let startTime = 0;
    if (!arc) {
      // exit if no cords in array
      return;
    }
    // const arc = waypoints;
    console.log(arc);

    //const STEPS = Number(minutes) * 60 * 1000;
    // const arc = useCallback(() => {
    //   console.log(
    //     routeStations,
    //     index,
    //     minutes,
    //     color,
    //     id,
    //     station,
    //     stationSlice
    //   );

    //   const STEPS = Number(minutes) * 60 * 1000;
    //   let results = [];
    //   // const STEPS = Number(minutes) * 1000 * 60;
    //   const locations = routeStations[index - 1].geoSlice;
    //   console.log(locations, minutes, station);
    //   const line = lineString(locations); // our array of lat/lngs
    //   const distance = lineDistance(line, OPTIONS);
    //   console.log(line, distance);
    //   for (let i = 0; i < distance; i += distance / STEPS) {
    //     let segment = along(line, i, OPTIONS);
    //     results.push(segment.geometry.coordinates);
    //   }
    //   return results;
    // }, [station]);
    // clone.current = markerRef.current.leafletElement.options.position;
    //console.log(current, minutes);

    // const line = lineString(locations); // our array of lat/lngs
    // const distance = lineDistance(line, OPTIONS);
    // console.log(line, distance);
    // for (let i = 0; i < distance; i += distance / STEPS) {
    //   let segment = along(line, i, OPTIONS);
    //   arc.push(segment.geometry.coordinates);
    // }
    // console.log(arc);
    const animate = timestamp => {
      if (startTime === 0) {
        startTime = timestamp;
      }
      const runtime = timestamp - startTime;
      const timeStep = Math.round(runtime);

      const newPosition = arc[timeStep] || arc[arc.length - 1];
      const [lon, lag] = newPosition;
      console.log(newPosition, startTime, arc, lon, lag, station);
      markerRef.current.leafletElement.setLatLng([lag, lon]);
      //setCurrentLocation(arc[timeStep] || arc[arc.length - 1]);
      console.log(
        arc[timeStep],
        startTime,
        // currentRef,
        timeStep,
        newPosition,
        STEPS,
        timeStep,
        station,
        arc
        // currentLocation
      );
      current = newPosition;
      // console.log(currentRef);
      console.log(current);
      if (timeStep <= STEPS) {
        requestAnimationFrame(t => animate(t));
        //   setTimeout(() => {
        //     window.requestAnimationFrame(animate);
        //   }, 1000 / 60);
        // }
      }
    };
    // function animate(timestamp) {
    //   console.log(arc);
    //   // const current = clone.current;
    //   // clone.current = markerRef;
    //   // animate function to set location
    //   const runtime = timestamp - startTime;
    //   const timeStep = Math.round(runtime);

    //   const newPosition = arc[timeStep] || arc[arc.length - 1];
    //   const [lon, lag] = newPosition;
    //   console.log(newPosition, startTime);
    //   markerRef.current.leafletElement.setLatLng([lag, lon]);
    //   //setCurrentLocation(arc[timeStep] || arc[arc.length - 1]);
    //   console.log(
    //     arc[timeStep],
    //     startTime,
    //     // currentRef,
    //     timeStep,
    //     newPosition,
    //     STEPS,
    //     timeStep,
    //     station,
    //     arc
    //     // currentLocation
    //   );
    //   current = newPosition;
    //   // console.log(currentRef);
    //   console.log(current);
    //   if (timeStep <= STEPS) {
    //     window.requestAnimationFrame(animate);
    //     //   setTimeout(() => {
    //     //     window.requestAnimationFrame(animate);
    //     //   }, 1000 / 60);
    //     // }
    //   }
    // }
    // cancelAnimationFrame(frameId);
    // const frameId = window.requestAnimationFrame(timeStamp => {
    //   startTime = timeStamp;
    //   console.log(startTime, station);
    //   animate(timeStamp);
    // });

    const frameId = requestAnimationFrame(t => animate(t));

    return () => {
      //startTime = 0;
      cancelAnimationFrame(frameId);
    };
    // setTimeout(() => {
    //   frameId = window.requestAnimationFrame(timeStamp => {
    //     startTime = timeStamp;
    //     console.log(startTime, station);
    //     animate(timeStamp);
    //   });
    // }, 1000 / 60);
  }, [arc]);

  console.log(station);

  //   useEffect(() => {
  //     if (prevCoors == null) return;

  //     const [prevLat, prevLong] = prevCoors;
  //     const [lat, long] = coors;
  //     let animationStartTime;

  //     const animateMarker = timestamp => {
  //       if (animationStartTime == null) animationStartTime = timestamp;

  //       const progress = (timestamp - animationStartTime) / 5000;

  //       if (progress > 1) return;

  //       const currLat = prevLat + (lat - prevLat) * progress;
  //       const currLong = prevLong + (long - prevLong) * progress;

  //       const position = new LatLng(currLat, currLong);

  //       markerRef.current.leafletElement.setLatLng(position);

  //       requestAnimationFrame(animateMarker);
  //     };

  //     const animationFrame = requestAnimationFrame(animateMarker);

  //     // eslint-disable-next-line consistent-return
  //     return () => cancelAnimationFrame(animationFrame);
  //   }, [coors, prevCoors]);

  return (
    <Marker
      icon={iconTrain}
      position={
        !markerRef.current
          ? leavingPos
          : markerRef.current.leafletElement._latlng
      }
      key={id}
      // onClick={handleActiveVehicleUpdate(plate, coors)}
      ref={markerRef}
    ></Marker>
  );
});

export default NewMarker;
