import actionType from "../actions/checkAchievementsActions";
import { IAction } from "@Constants/models";

const initState: any = {
  check: false
};

function checkAchievementsReducer(
  state: typeof initState = initState,
  action: IAction
) {
  switch (action.type) {
    case actionType.CHECK: {
      return {
        check: true
      };
    }
    case actionType.UNCHECK: {
      return {
        check: false
      };
    }

    default:
      return state;
  }
}

export default checkAchievementsReducer;
