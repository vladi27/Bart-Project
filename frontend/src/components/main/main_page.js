import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, CircleMarker } from "react-leaflet";
import L from "leaflet";
// import { DropdownMultiple, Dropdown } from "reactjs-dropdown-component";
import Select from "react-select";
import jsonObject from "../../waypoints/all_shapes";
import MapContainer from "./map_container";
import { throws } from "assert";

// const data = require("json!./../../src/waypoints/all_shapes");

class MainPage extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   routes: this.props.routes
    //   // stations: [{longitude: "-43.7833", latitude: "-5.3823"}],
    //   // space_station: {longitude: "-43.7833", latitude: "-5.3823"},
    //   // map : this.mymap,
    //   // marker: this.circleMarker
    // };

    this.state = { currentSelections: [] };
  }

  componentDidMount() {
    // this.props.receiveWayPoints(jsonObject);
    // this.props.fetchSpaceStation();
    // then(response =>
    //   this.setState({ space_station: response.space_station })
    // );
    this.props
      .fetchRoutes()
      .then(response => this.setState({ routes: this.props.routes }));
    this.props.fetchStations();

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 20].map(ele =>
      this.props.fetchRouteStations(ele)
    );

    this.props.receiveWayPoints(jsonObject);

    //   .then(response => this.setState({ stations: response.stations }));
    // this.props
    //   .fetchRouteInfo()
    //   .then(response => this.setState({ route_info: response.route_info }));
    // this.props.fetchInitialStationDataSouth();
    // this.props.fetchInitialStationDataNorth();
  }

  // componentDidMount() {
  //   // this.interval = setInterval(() => this.props.fetchSpaceStation(), 10000);
  //   // this.props.receiveWayPoints(jsonObject);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  handleChange(value) {
    // let temp = JSON.parse(JSON.stringify(this.state[key]));
    // let ele = temp[id];
    this.setState({ currentSelections: value });
  }

  // checkState() {
  //   this.setInterval(() => {
  //   this.state.routes.map(route => (
  //       if (route.selected === true) {

  //       }
  //     ))
  //   }, 500);
  // }

  render() {
    const allRoutes = this.props.routes;
    const options = allRoutes.map(ele => {
      return {
        value: ele.number,
        label: ele.title
      };
    });
    const currentSelections = this.state.currentSelections;
    // const options = this.props.allRoutes.map(ele => ele.title);
    console.log(options);
    const position = [37.844443, -122.252341];
    console.log(jsonObject);

    const allStations = this.props.stations;
    console.log(this.props.routes);

    console.log(allStations);
    console.log(this.state);

    // const waypoints = jsonObject;

    // console.log(waypoints);

    console.log(this.props);
    // const customMarker = L.icon({ iconUrl: require('../../assets/images/iss.png')})

    if (this.props.stations.length === 0) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <div className="react-select__menu">
            <Select
              options={options}
              isMulti
              styles={{ marginBottom: "200px" }}
              placeholder={"hello"}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={this.handleChange.bind(this)}
            />
          </div>
          {/* <div className="test">
            <DropdownMultiple
              titleHelper="Routes"
              title="Select routes"
              list={this.state.routes}
              toggleItem={this.toggleSelected}
              onClick={e => this.handleChange}
              // toggleItem={this.handleChange}
            />
          </div> */}

          {currentSelections ? (
            this.state.currentSelections.map(ele => {
              let routeNum = ele.value;
              let route = this.props.allRoutes[routeNum];
              let routeStations = route.stations;

              // return selectedRoute;

              return (
                <MapContainer
                  // stations={allStations}
                  currentRoutes={this.state.currentSelections}
                  waypoints={this.props.waypoints}
                />
              );
            })
          ) : (
            <h2>Hello</h2>
          )}
        </div>
      );
    }
  }
}

export default MainPage;
