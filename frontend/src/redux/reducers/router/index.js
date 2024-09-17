const initialState = {
  data: null,
};

const routerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_DATAS":
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};
export default routerReducer;
