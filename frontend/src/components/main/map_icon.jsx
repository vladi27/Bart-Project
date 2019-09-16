import L from "leaflet";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";

// const MapLabel = () => {
//   const icon = divIcon({
//     className: 'map-label',
//     html: `<span>Label Text</span>`
//   });

const iconTrain = divIcon({
  className: "map-label",
  html: `<span>Label Text</span>`
});

export default iconTrain;
