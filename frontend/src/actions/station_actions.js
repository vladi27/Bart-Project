import {
  getStations,
  getRouteInfo,
  getInitialStationDataSouth,
  getInitialStationDataNorth,
  getRoutes,
  getSchedules,
  getRouteStations,
  fetchCurrentEtas,
  getStationDepartures

  // getRouteInfo
} from "../util/station_api_util";
import jsonObj from "../waypoints/all_shapes";
export const RECEIVE_STATIONS = "RECEIVE_STATIONS";
export const RECEIVE_INITIAL_SB_INFO = "RECEIVE_INITIAL_SB_INFO";
export const RECEIVE_INITIAL_NB_INFO = "RECEIVE_INITIAL_NB_INFO";
export const RECEIVE_ROUTE_INFO = "RECEIVE_ROUTE_INFO";
export const RECEIVE_WAYPOINTS = "RECEIVE_WAYPOINTS";
export const RECEIVE_ROUTES = "RECEIVE_ROUTES";
export const RECEIVE_ROUTE_STATIONS = "RECEIVE_ROUTE_STATIONS";
export const RECEIVE_CURRENT_ETAS = "RECEIVE_CURRENT_ETAS";
export const RECEIVE_ROUTE_SCHEDULES = "RECEIVE_ROUTE_SCHEDULES";
export const RECEIVE_STATION_ETA = "RECEIVE_STATION_ETA";
export const CREATE_TRAINS = "CREATE_TRAINS";
export const UPDATE_TRAINS = "UPDATE_TRAINS";

const stationsSouthBound = [
  "ANTC",
  "PCTR",
  "PITT",
  "NCON",
  "CONC",
  "PHIL",
  "WCRK",
  "LAFY",
  "ORIN",
  "ROCK",
  "MCAR",
  "19TH",
  "12TH",
  "WOAK",
  "EMBR",
  "MONT",
  "POWL",
  "CIVC",
  "16TH",
  "24TH",
  "GLEN",
  "BALB",
  "DALY",
  "COLM",
  "SSAN",
  "SBRN",
  "SFIA",
  "MLBR"
];

export const routes = {
  1: {
    hexcolor: "#ffff33",
    destination: "Millbrae",
    abbreviation: "MLBR",
    direction: "South",
    color: "Yellow"
  },

  2: {
    hexcolor: "#ffff33",
    abbreviation: "ANTC",
    destination: "Antioch",
    direction: "North",
    color: "Yellow"
  },

  3: {
    hexcolor: "#ffff33",
    abbreviation: "RICH",
    destination: " Richmond",
    direction: "North",
    color: "Orange"
  },

  4: {
    hexcolor: "#ffff33",
    destination: "Warm Springs",
    abbreviation: "WARM",
    direction: "South",
    color: "Orange"
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "DALY",
    direction: "South",
    abbreviation: "DALY"
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Warm Springs",
    abbreviation: "WARM",
    abbreviation: "DALY",
    direction: "North"
  },

  7: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "South",

    destination: "Millbrae",
    abbreviation: "MLBR"
  },

  8: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "North",

    destination: "Richmond",
    abbreviation: "RCH"
  }
};
const nextTrain = etas => {
  let earliestDep = etas[0][1];
  if (earliestDep === "leaving") {
    return {
      prevStation: etas[0][0],
      nextStation: {
        nextStationAbbrev: etas[1][0],
        nextStationEstimatedDep: etas[1][1]
      }
    };
  }
  let idx;
  for (let i = 1; i < etas.length; i++) {
    if (etas[i][1] === "leaving") {
      return {
        prevStation: etas[i][0],
        nextStation: {
          nextStationAbbrev: etas[i + 1][0],
          nextStationEstimatedDep: etas[i + 1][1]
        }
      };
    }
    if (etas[i][1] < earliestDep) {
      earliestDep = etas[i][1];
      idx = i;
    }
  }
  const prevStationIdx = stationsSouthBound.indexOf(etas[idx][0]) - 1;
  return {
    prevStation: stationsSouthBound[prevStationIdx],
    nextStation: {
      nextStationAbbrev: etas[idx][0],
      nextStationEstimatedDep: etas[idx][1]
    }
  };
};

export const receiveStations = stations => ({
  type: RECEIVE_STATIONS,
  stations: stations.data.root.stations.station
});
export const receiveRoutes = routes => {
  return {
    type: RECEIVE_ROUTES,
    routes: routes.data.root.routes.route
  };
};
export const receiveCurrentEtas = etas => {
  return {
    type: RECEIVE_CURRENT_ETAS,
    etas: etas.data.root.station
  };
};
export const receiveStationEta = (eta, abbr) => {
  return {
    type: RECEIVE_STATION_ETA,
    eta: eta.data.root.station,
    abbr
  };
};

export const receiveRouteInfo = info => ({
  type: RECEIVE_ROUTE_INFO,
  info
});

export const receiveInitialSBInfo = info => ({
  type: RECEIVE_INITIAL_SB_INFO,
  info
});

export const receiveInitialNBInfo = info => ({
  type: RECEIVE_INITIAL_NB_INFO,
  info
});

export const receiveRouteStations = stations => ({
  type: RECEIVE_ROUTE_STATIONS,
  stations: stations.data.root.routes.route
});
export const receiveRouteSchedules = (schedules, id) => ({
  type: RECEIVE_ROUTE_SCHEDULES,
  schedules: schedules.data.root.route,
  id
});
export const createTrains = route => ({
  type: CREATE_TRAINS,
  route
});

export const updateTrains = route => ({
  type: UPDATE_TRAINS,
  route
});

export const receiveWayPoints = jsonObj => ({
  type: RECEIVE_WAYPOINTS,
  waypoints: jsonObj
});

export const getCurrentEtas = () => dispatch =>
  fetchCurrentEtas()
    .then(etas => dispatch(receiveCurrentEtas(etas)))
    .catch(err => console.log(err));

export const fetchStationDepartures = abbr => dispatch =>
  getStationDepartures(abbr)
    .then(eta => dispatch(receiveStationEta(eta, abbr)))
    .catch(err => console.log(err));

export const fetchRouteStations = id => dispatch =>
  getRouteStations(id)
    .then(stations => dispatch(receiveRouteStations(stations)))
    .catch(err => console.log(err));

export const fetchRouteSchedules = id => dispatch =>
  getSchedules(id)
    .then(schedules => dispatch(receiveRouteSchedules(schedules, id)))
    .catch(err => console.log(err));

export const fetchRoutes = () => dispatch =>
  getRoutes()
    .then(routes => dispatch(receiveRoutes(routes)))
    .catch(err => console.log(err));

export const fetchStations = () => dispatch =>
  getStations()
    .then(stations => dispatch(receiveStations(stations)))
    .catch(err => console.log(err));

export const fetchRouteInfo = () => dispatch =>
  getRouteInfo()
    .then(info => dispatch(receiveRouteInfo(info)))
    .catch(err => console.log(err));

export const fetchInitialStationDataSouth = () => dispatch =>
  getInitialStationDataSouth().then(responses => {
    const etas = [];
    const extractETD = (stn, response) => {
      const etds = response.data.root.station[0].etd;
      if (etds) {
        const currETD = etds.filter(
          stn => stn.abbreviation === "SFIA" || stn.abbreviation === "MLBR"
        );
        if (currETD.length) {
          const etd = currETD[0].estimate[0];
          const eta = etd.minutes;
          etas.push([stn, eta]);
        }
      }
    };
    responses.forEach(response => {
      const stn = response.data.root.station[0].abbr;
      return extractETD(stn, response);
    });
    return dispatch(receiveInitialSBInfo(nextTrain(etas)));
  });

export const fetchInitialStationDataNorth = () => dispatch =>
  getInitialStationDataNorth().then(responses => {
    const etas = [];
    const extractETD = (stn, response) => {
      const etds = response.data.root.station[0].etd;
      if (etds) {
        const currETD = etds.filter(stn => stn.abbreviation === "ANTC");
        if (currETD.length) {
          const etd = currETD[0].estimate[0];
          const eta = etd.minutes;
          etas.push([stn, eta]);
        }
      }
    };
    responses.forEach(response => {
      const stn = response.data.root.station[0].abbr;
      return extractETD(stn, response);
    });
    return dispatch(receiveInitialNBInfo(nextTrain(etas)));
  });
