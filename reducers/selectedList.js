const selectedListReducer = (
  state = { id: '', title: '', budget: 0, list: [] },
  action
) => {
  switch (action.type) {
    case 'SEND_SELECTED_LIST':
      return action.payload;

    default:
      return state;
  }
};
export default selectedListReducer;
