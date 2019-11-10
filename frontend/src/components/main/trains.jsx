import React, {
  Component,
  PureComponent,
  useState,
  useEffect,
  useLayoutEffect,
  memo,
  useMemo,
  useRef,
  useReducer,
  useCallback,
  useImperativeHandle
} from "react";

import L from "leaflet";
import NewMarker from "./marker";

const Trains = React.memo(
  React.forwardRef(function Trains(props, ref) {
    //console.log(update);

    const STEPS = 60 * 1000;
    const refs = useRef([]);
    const zoomRef = useRef(null);

    console.log(trains);
    let startTime = 0;
    let frameId = null;
    const trains = props.trains;

    const animate = timestamp => {
      // const runtime = timestamp - startTime;
      // const timeStep = Math.round(runtime);
      refs.current.map(child => {
        if (child && !zoomRef.current) {
          console.log(child);
          child.update(timestamp);
        }
      });

      setTimeout(() => {
        L.Util.requestAnimFrame(animate);
      }, 1000 / 10);
    };

    useImperativeHandle(ref, () => ({
      updateZoom() {
        const bool = zoomRef.current;
        console.log(bool);
        zoomRef.current = !bool;
      }
    }));

    useLayoutEffect(() => {
      // if (!refs) {
      //   return;
      // }

      console.log(refs);
      if (!frameId) {
        // console.log(timeStep);
        //cancelAnimationFrame(frameId);
        frameId = L.Util.requestAnimFrame(t => {
          //startTime = t;
          animate(t);
        });
      }

      return () => {
        L.Util.cancelAnimFrame(frameId);
        frameId = null;
      };
    }, []);

    return (
      <>
        {trains.map((train, index) => {
          let num = train.route;
          let routeStations = props.routes[num].stations;
          return (
            <NewMarker
              key={train.id}
              color={train.hexcolor}
              routeStations={routeStations}
              stationIndex={train.stationIdx}
              station={train.stationName}
              minutes={train.minutes}
              lastTrain={train.lastTrain}
              destination={train.dest}
              removeTrain={props.removeTrain}
              id={train.id}
              totalTime={train.totalMinutes}
              initialPos={train.initialPosition}
              initCoords={train.initCoords}
              currentSlice={train.currentSlice}
              ref={ins => (refs.current[index] = ins)}
              getMap={props.getMap}
              //zoom={zoom}
            />
          );
        })}
      </>
    );
    // <NewMarker
    //   key={trains.id}
    //   color={train.hexcolor}
    //   station={train.stationName}
    //   minutes={train.minutes}
    //   id={train.id}
    //   currentSlice={train.currentSlice}
    // />
  })
);

export default Trains;
