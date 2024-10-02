import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "./styles/style.scss";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18next from "./assets/translate/i18next";
import { Provider } from "react-redux";
import store from "@Store/index";
import AppProvider from "./components/context";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>

  <I18nextProvider i18n={i18next}>
    <Provider store={store}>
      <AppProvider>
        <App />
      </AppProvider>
    </Provider>
  </I18nextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
