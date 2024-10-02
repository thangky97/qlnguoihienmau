import actionType from "../actions/productActions";
import { IAction } from "@Constants/models";

let initalState: Array<any> = [];

function productReducer(state = initalState, action: IAction) {
  switch (action.type) {
    case actionType.PRODUCT_UPDATE: {
      let listProduct: Array<any> = [];
      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          let item = action.payload[i];
          if (item) {
            listProduct.push({
              ...item,
              product_description:
                (item?.product_descriptions &&
                  item?.product_descriptions[0] &&
                  item?.product_descriptions[0]?.description) ||
                "",
              product_name:
                (item?.product_names &&
                  item?.product_names[0] &&
                  item?.product_names[0]?.name) ||
                "",
              product_descriptions: undefined,
              product_names: undefined
            });
          }
        }
      }
      return listProduct;
    }

    case actionType.PRODUCT_LIST: {
      let listProduct: Array<any> = [];
      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          let item = action.payload[i];
          if (item) {
            listProduct.push(item);
          }
        }
      }
      return listProduct;
    }
    default:
      return state;
  }
}

export default productReducer;
