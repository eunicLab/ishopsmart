const IdReducer = (state = '', action) => {
  switch (action.type) {
    case 'SEND_ID':
      return action.payload;

    default:
      return state;
  }
};
export default IdReducer;
