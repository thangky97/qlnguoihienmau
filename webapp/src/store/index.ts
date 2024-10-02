import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import app from "./reducers/app";
import product from "./reducers/product";
import monitoring from "./reducers/monitoring";
import cart from "./reducers/cart";
import checkAchievements from "./reducers/checkAchievements";

const rootReducer = combineReducers({
  user,
  app,
  product,
  monitoring,
  cart,
  checkAchievements
});

const store = configureStore({
  reducer: rootReducer
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
