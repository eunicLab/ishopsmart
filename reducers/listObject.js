const listObjectReducer = (state = [], action) => {
  switch (action.type) {
    case 'SEND_LIST_OBJECT':
      return action.payload;

    default:
      return state;
  }
};
export default listObjectReducer;
