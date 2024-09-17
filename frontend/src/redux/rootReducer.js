import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./Slices/UserSlice";
import routerReducer from "./reducers/router";

const rootReducer = combineReducers({
  users: userReducer,
  router: routerReducer,
});
export default rootReducer;
