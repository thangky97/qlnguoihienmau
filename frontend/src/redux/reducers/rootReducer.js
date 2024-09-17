import { combineReducers } from "redux";
import auth from "./auth";
import layout from "./layout";
import navbar from "./navbar";
import router from "./router";

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  router,
});

export default rootReducer;
