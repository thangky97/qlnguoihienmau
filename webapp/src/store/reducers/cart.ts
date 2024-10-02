import actionType from "../actions/cartActions";
import { IAction } from "@Constants/models";

let initalState: any = {
  quantity: 0
};

function cartReducer(state = initalState, action: IAction) {
  switch (action.type) {
    case actionType.CART_UPDATE: {
      const dataCart: any[] = JSON.parse(
        window.localStorage.getItem("user-cart") || "[]"
      );
      return {
        quantity: dataCart.length || 0
      };
    }
    default:
      return state;
  }
}

export default cartReducer;
