export const loggedIn = (detail) => {
  return {
    type: 'LOGGED_IN',
    payload: detail,
  };
};

export const sendLoginData = (detail) => {
  return {
    type: 'SEND_LOGIN_DATA',
    payload: detail,
  };
};

export const handleTopSignUpButton = () => {
  return {
    type: 'HANDLE_TOP_SIGN_UP_BUTTON',
  };
};

export const handleTopLoginButton = () => {
  return {
    type: 'HANDLE_TOP_LOGIN_BUTTON',
  };
};

export const displayLoadingImage = () => {
  return {
    type: 'LOADING',
  };
};

export const noDisplayLoadingImage = () => {
  return {
    type: 'NOT_LOADING',
  };
};

export const errorSignUpFailed = () => {
  return {
    type: 'HANDLE_SIGN_UP_FAILED',
  };
};

export const errorLoginFailed = () => {
  return {
    type: 'HANDLE_LOGIN_FAILED',
  };
};

export const errorFieldEmpty = () => {
  return {
    type: 'REQUIRED_FIELD_EMPTY',
  };
};

export const noError = () => {
  return {
    type: 'NO_ERROR',
  };
};

export const errorPrivacyPolicy = () => {
  return { type: 'PRIVACY_POLICY' };
};

export const sendNavButtonDisplay = (detail) => {
  return {
    type: 'NAV_BUTTON_DISPLAY',
    payload: detail,
  };
};

export const sendNavButton = (detail) => {
  return {
    type: 'NAV_BUTTON',
    payload: detail,
  };
};

export const sendListObject = (detail) => {
  return {
    type: 'SEND_LIST_OBJECT',
    payload: detail,
  };
};

export const sendSelectedList = (detail) => {
  return {
    type: 'SEND_SELECTED_LIST',
    payload: detail,
  };
};

export const sendSelectedItem = (detail) => {
  return {
    type: 'SEND_SELECTED_ITEM',
    payload: detail,
  };
};

export const sendId = (detail) => {
  return {
    type: 'SEND_ID',
    payload: detail,
  };
};
