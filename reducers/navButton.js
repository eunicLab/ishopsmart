const navButtonReducer = (state = false, action) => {
  switch (action.type) {
    case 'NAV_BUTTON':
      return action.payload;

    default:
      return state;
  }
};
export default navButtonReducer;
