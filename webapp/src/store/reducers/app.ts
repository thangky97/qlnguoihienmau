import actionType from "../actions/appActions";
import { IAppConfig, IAction } from "@Constants/models";

const initState: IAppConfig | Object = JSON.parse(window.localStorage.getItem("app_config") || "{}");

function userReducer(state: typeof initState = initState, action: IAction) {
  switch (action.type) {
    case actionType.APP_CHANGE: {
      window.localStorage.setItem(
        "app_config",
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
    default:
      return state;
  }
}

export default userReducer;
