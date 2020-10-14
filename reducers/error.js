const errorReducer = (state = '', action) => {
  switch (action.type) {
    case 'HANDLE_SIGN_UP_FAILED':
      return 'There is already an account with this email address';
    case 'HANDLE_LOGIN_FAILED':
      return 'Incorrect email address or password';
    case 'REQUIRED_FIELD_EMPTY':
      return 'Required field empty';
    case 'NO_ERROR':
      return '';
    case 'PRIVACY_POLICY':
      return 'You must Agree to the Privacy Policy';
    default:
      return state;
  }
};
export default errorReducer;
