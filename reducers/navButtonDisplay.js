const navButtonDisplayReducer = (state = false, action) => {
  switch (action.type) {
    case 'NAV_BUTTON_DISPLAY':
      return action.payload;

    default:
      return state;
  }
};
export default navButtonDisplayReducer;
