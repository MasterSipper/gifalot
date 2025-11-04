import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Provider } from "react-redux";
import { store } from "./store";
import { captchaKey } from "./static/captchaKey";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
      <App />
    </GoogleReCaptchaProvider>
  </Provider>
);

reportWebVitals();
