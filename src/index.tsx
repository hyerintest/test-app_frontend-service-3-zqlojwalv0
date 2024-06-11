import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import rootReducer from "./stores";
import { configureStore } from "@reduxjs/toolkit";
import {Config} from "./config";

const store = configureStore({
  reducer: rootReducer,
});

let path = Config.APP_SUB_PATH;

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter basename={path}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
