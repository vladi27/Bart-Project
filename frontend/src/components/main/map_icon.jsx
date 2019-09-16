import L from "leaflet";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";
import React, { Component } from "react";

// const MapLabel = () => {
//   const icon = divIcon({
//     className: 'map-label',
//     html: `<span>Label Text</span>`
//   });

const iconTrain = L.divIcon({
  // className: "marker"
  // html: `<span>Label Text</span>`
  html: '<i class="fas fa-train"></i>',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  className: "custom-div-icon"
});

export default iconTrain;
