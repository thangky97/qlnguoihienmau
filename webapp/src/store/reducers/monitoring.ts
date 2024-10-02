import actionType from "../actions/monitoringActions";
import { IMonitoring, IAction } from "@Constants/models";

const initState: IMonitoring = JSON.parse(
  window.localStorage.getItem("monitoring") || "{}"
);

function monitoringReducer(
  state: typeof initState = initState,
  action: IAction
) {
  switch (action.type) {
    case actionType.CONTROL: {
      window.localStorage.setItem(
        "monitoring",
        JSON.stringify({
          ...state,
          ...action.payload
        })
      );
      return {
        ...state,
        ...action.payload
      };
    }
    case actionType.SET_COUNTRY: {
      window.localStorage.setItem(
        "monitoring",
        JSON.stringify({
          ...state,
          ...action.payload
        })
      );
      return {
        ...state,
        ...action.payload
      };
    }
    case actionType.SET_CITY: {
      window.localStorage.setItem(
        "monitoring",
        JSON.stringify({
          ...state,
          ...action.payload
        })
      );
      return {
        ...state,
        ...action.payload
      };
    }
    case actionType.SET_URL: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
}

export default monitoringReducer;
