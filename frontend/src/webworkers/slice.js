import { exposeWorker } from "react-hooks-worker";

import { lineString, along, lineDistance, lineSlice, point } from "@turf/turf";
const OPTIONS = { units: "kilometers" };
const STEPS = 60000;
const currentPath = slice => {
  console.log(slice);
  let distance = lineDistance(slice, OPTIONS);
  let results = [];
  for (let i = 0; i < distance; i += distance / STEPS) {
    let segment = along(slice, i, OPTIONS);
    results.push(segment.geometry.coordinates);
  }
  return results;
};

exposeWorker(currentPath);
