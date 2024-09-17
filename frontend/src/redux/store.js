import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: rootReducer,
});

export const useAppDispatch = () => useDispatch();
