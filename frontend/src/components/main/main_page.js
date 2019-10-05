import React, { Component, PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, CircleMarker } from "react-leaflet";
import L from "leaflet";
// import { DropdownMultiple, Dropdown } from "reactjs-dropdown-component";
import Select from "react-select";
import jsonObject from "../../waypoints/all_shapes";
import MapContainer from "./map_container";
import { throws } from "assert";
import WindowedSelect from "react-windowed-select";
import RouteContainer from "./route_container";
import { components, createFilter } from "react-windowed-select";
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

    this.state = { currentSelections: [], etas: [] };
  }

  componentDidMount() {
    const routeIds = [1, 2, 3, 4, 5, 6, 7, 8];
    // this.props.receiveWayPoints(jsonObject);
    // this.props.fetchSpaceStation();
    // then(response =>
    //   this.setState({ space_station: response.space_station })
    // );
    this.props
      .fetchRoutes()
      .then(response => this.props.fetchStations())
      .then(() => {
        routeIds.map(ele => {
          this.props.fetchRouteStations(ele);
        });
      });

    console.count();

    // this.props
    //   .getCurrentEtas()
    //   .then(response => this.setState({ etas: this.props.etas }));

    // this.props.fetchRouteSchedules(1);

    this.props.receiveWayPoints(jsonObject);
    setTimeout(() => {
      this.props.getCurrentEtas().then(() => {
        routeIds.map(id => {
          this.props.createTrains(id);
        });
      });
    }, 3000);

    // this.interval = setInterval(() => {
    //   this.props.getCurrentEtas().then(() => {
    //     this.props.updateTrains(2);
    //   });
    // }, 60000);
    this.interval = setInterval(() => {
      this.props.getCurrentEtas();
    }, 25000);

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

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  //   updateValue(value) {
  //   this.setState({ value: value });
  // },
  // getValue: function() {
  //   if (!this.state.value) {
  //     return 'Some default text';
  //   }
  //   return this.state.value;
  // }

  handleChange(value) {
    this.setState({ currentSelections: value });
  }

  // customFilter() {
  //   createFilter({ ignoreAccents: false });
  // }

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
    const customFilter = createFilter({ ignoreAccents: false });
    const options = [
      {
        value: "20",
        label: "Oakland Int'l Airport - Coliseum"
      },
      {
        value: "19",
        label: "Coliseum - Oakland Int'l Airport"
      },
      {
        value: "14",
        label: "SFO - Millbrae"
      },
      {
        value: "13",
        label: "Millbrae - SFO"
      },
      {
        value: "12",
        label: "Daly City - Dublin/Pleasanton"
      },
      {
        value: "11",
        label: "Dublin/Pleasanton - Daly City"
      },
      {
        value: "10",
        label: "MacArthur - Dublin/Pleasanton"
      },
      {
        value: "9",
        label: "Dublin/Pleasanton - MacArthur"
      },
      {
        value: "8",
        label: "Millbrae/Daly City - Richmond"
      },
      {
        value: "7",
        label: "Richmond - Daly City/Millbrae"
      },
      {
        value: "6",
        label: "Daly City - Warm Springs/South Fremont"
      },
      {
        value: "5",
        label: "Warm Springs/South Fremont - Daly City"
      },
      {
        value: "4",
        label: "Richmond - Warm Springs/South Fremont"
      },
      {
        value: "3",
        label: "Warm Springs/South Fremont - Richmond"
      },
      {
        value: "2",
        label: "Millbrae/SFIA - Antioch"
      },
      {
        value: "1",
        label: "Antioch - SFIA/Millbrae"
      }
    ];

    const currentSelections = this.state.currentSelections;
    // const options = this.props.allRoutes.map(ele => ele.title);

    const position = [37.844443, -122.252341];
    // console.log(jsonObject);

    console.log(this.state);
    // console.count();
    // console.log(this.props.routes);

    // console.log(allStations);
    // console.log(this.state);

    // const waypoints = jsonObject;

    // console.log(waypoints);

    // console.log(this.props);
    // const customMarker = L.icon({ iconUrl: require('../../assets/images/iss.png')})

    return (
      <div>
        <div className="react-select__menu">
          <WindowedSelect
            options={options}
            isMulti
            values={this.state.currentSelections}
            styles={{ marginBottom: "200px" }}
            placeholder={"hello"}
            className="basic-multi-select"
            classNamePrefix="select"
            filterOption={customFilter}
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
        <Map center={position} zoom={11}>
          {currentSelections ? (
            this.state.currentSelections.map((ele, idx) => {
              let routeNumber = ele.value;
              let key = "routeID -" + routeNumber;

              // let routeID = route.routeID;
              // let schedule = this.props.schedules[route.number];
              return (
                <RouteContainer
                  // route={route}

                  // waypoints={way2}
                  routeNumber={routeNumber}
                  key={key}
                />
              );
            })
          ) : (
            <div></div>
          )}
          <TileLayer url="https://mt1.google.com/vt/lyrs=m@121,transit|vm:1&hl=en&opts=r&x={x}&y={y}&z={z}" />
          />
        </Map>
        ; })
      </div>
    );
  }
}

export default MainPage;

{
  /* <MapContainer
          // stations={allStations}
          currentRoutes={this.state.currentSelections}
          waypoints={this.props.waypoints}
          allStations={this.props.allStations}
          routes={this.props.routes}
          schedules={this.props.schedules}
          fetchStationDepartures={this.props.fetchStationDepartures}
          getCurrentEtas={this.props.getCurrentEtas}
          etas={etas} */
}
