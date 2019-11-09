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
  useCallback
} from "react";

import L from "leaflet";
import NewMarker from "./marker";

const Trains = React.memo(function Trains({
  trains,
  update,
  getMap,
  routes,
  removeTrain
}) {
  console.log(update);
  const STEPS = 60 * 1000;
  const refs = useRef([]);

  console.log(trains);
  let startTime = 0;

  useLayoutEffect(() => {
    // if (!refs) {
    //   return;
    // }

    console.log(refs);

    // console.log(timeStep);
    const animate = timestamp => {
      // const runtime = timestamp - startTime;
      // const timeStep = Math.round(runtime);
      refs.current.map(child => {
        if (child) {
          console.log(child);
          child.update(timestamp);
        }
      });

      setTimeout(() => {
        L.Util.requestAnimFrame(animate);
      }, 1000 / 10);
    };
    //cancelAnimationFrame(frameId);
    const frameId = L.Util.requestAnimFrame(t => {
      //startTime = t;
      animate(t);
    });

    return () => L.Util.cancelAnimFrame(frameId);
  }, []);

  return (
    <>
      {trains.map((train, index) => {
        let num = train.route;
        let routeStations = routes[num].stations;
        return (
          <NewMarker
            key={train.id}
            color={train.hexcolor}
            routeStations={routeStations}
            stationIndex={train.stationIdx}
            station={train.stationName}
            minutes={train.minutes}
            lastTrain={train.lastTrain}
            removeTrain={removeTrain}
            id={train.id}
            totalTime={train.totalMinutes}
            initialPos={train.initialPosition}
            initCoords={train.initCoords}
            currentSlice={train.currentSlice}
            ref={ins => (refs.current[index] = ins)}
            getMap={getMap}
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
});

export default Trains;
