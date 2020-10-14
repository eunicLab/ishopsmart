const selectedItemReducer = (
  state = { id: '', item: '', price: 0, checked: false, sorted: 'false' },
  action
) => {
  switch (action.type) {
    case 'SEND_SELECTED_ITEM':
      return action.payload;

    default:
      return state;
  }
};
export default selectedItemReducer;
