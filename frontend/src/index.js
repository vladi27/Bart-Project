import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";
import jwt_decode from "jwt-decode";

import { setAuthToken } from "./util/session_api_util";
import { logout } from "./actions/session_actions";

document.addEventListener("DOMContentLoaded", () => {
  let store;
  const preloadedState = {
    stations: {},
    session: { isAuthenticated: true },
    space_station: {},
    routes: {},
    etas: {},
    trains: {}
  };
  store = configureStore();

  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);

    const decodedUser = jwt_decode(localStorage.jwtToken);

    const currentTime = Date.now() / 1000;

    //   if (decodedUser.exp < currentTime) {
    //     store.dispatch(logout());
    //     window.location.href = "/login";
    //   }
    // } else {
    //   store = configureStore();
    // }
  }
  window.getState = store.getState;

  window.store = store;

  const root = document.getElementById("root");

  ReactDOM.render(<Root store={store} />, root);
});
