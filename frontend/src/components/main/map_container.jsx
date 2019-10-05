import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import L from "leaflet";
import { connect } from "react-redux";
import { runInThisContext } from "vm";
import Station from "./stations";
import RouteContainer from "./route_container";
import AllStations from "./all_stations";

class MapPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waypoints: this.props.waypoints || [],
      routes: this.props.routes,
      currentRoutes: this.props.currentRoutes
    };

    // this.state = { stations: this.props.selectedRoute.stations || [] };
  }

  handleState(arr) {
    this.setState({ positions: arr });
  }

  // componentDidMount() {
  //   this.timer = setInterval(
  //     () =>
  //       this.setState({
  //         key: Math.floor(Math.random() * 100) + 1
  //       }),
  //     1000
  //   );
  // }

  componentDidMount() {
    console.log("intermi");
    this.setState({
      allStations: this.props.allStations,
      currentRoutes: this.props.currentRoutes
    });
    console.log("map");
    console.count();
  }

  //   shouldComponentUpdate(nextProps, nextState) {
  //     this.setState({ station: nextProps.selectedRoute.stations });
  //   }

  render() {
    let allStations = this.props.allStations;
    let routes = this.props.routes;
    // console.log(this.props);
    // console.log(this.state);

    // let abcd = this.props.currentRoutes.map(ele => {
    //   let route = routes[ele.value];
    //   let stations = route.stations;
    //   return stations.map(ele2 => {
    //     return allStations[ele2];
    //   });
    // });

    // const stations = abcd.reduce((acc, curr) => {
    //   return [...acc, ...curr];
    // }, []);

    const way2 = {};

    this.props.currentRoutes.map(ele => {
      let routeNum = Number(ele.value);
      // console.log(routeNum);
      way2["waypoints"] = this.state.waypoints[routeNum - 1].waypoints;
    });

    // console.log(way2);

    // const allPositions = el2.map(station => {
    //   let station2Lat = parseFloat(station.gtfs_latitude);
    //   let station2Long = parseFloat(station.gtfs_longitude);
    //   let arr = [station2Lat, station2Long];
    //   return arr;
    // });

    // this.setState({ positions: allPositions });

    const position = [37.844443, -122.252341];

    return (
      <Map center={position} zoom={11}>
        {/* <AllStations
          allStations={allStations}
          fetchStationDepartures={this.props.fetchStationDepartures}
        ></AllStations> */}
        <TileLayer url="https://mt1.google.com/vt/lyrs=m@121,transit|vm:1&hl=en&opts=r&x={x}&y={y}&z={z}" />
        {this.state.currentRoutes.map((ele, idx) => {
          let route = routes[ele.value];
          let routeNumber = route.number;
          let routeID = route.routeID;
          let schedule = this.props.schedules[route.number];
          // console.log(schedule);

          // let station2Lat = parseFloat(station.gtfs_latitude);
          // let station2Long = parseFloat(station.gtfs_longitude);
          // let arr = [station2Lat, station2Long];
          //   this.handleState(arr);
          //   this.setState({positions: arr });

          return (
            <RouteContainer
              // route={route}
              allStations={allStations}
              waypoints={way2}
              schedule={schedule}
              routeNumber={route.number}
              getCurrentEtas={this.props.getCurrentEtas}
              key={routeID}
              etas={this.props.etas}
              fetchStationDepartures={this.props.fetchStationDepartures}
            ></RouteContainer>
          );
        })}
        ; }
        {/* {Object.values(way2.waypoints).map(ele => {
          return <Polyline positions={ele} />;
        })} */}
      </Map>
    );
  }
}

export default MapPage;

{
  /* <CircleMarker
    key={10}
    center={[
        this.props.space_station.latitude,
        this.props.space_station.longitude
    ]}
    radius={12}
></CircleMarker> */
}
