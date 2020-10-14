import { combineReducers } from 'redux';
import loggedInReducer from './loggedIn';
import firstNameReducer from './firstName';
import signUpTopReducer from './signUpTop';
import loginTopReducer from './loginTop';
import createBtnReducer from './createBtn';
import loadingImageReducer from './loadingImage';
import { reducer as formReducer } from 'redux-form';
import errorReducer from './error';
import loginDataReducer from './loginData';
import listObjectReducer from './listObject';
import selectedListReducer from './selectedList';
import selectedItemReducer from './selectedItem';
import navButtonDisplayReducer from './navButtonDisplay';
import navButtonReducer from './navButton';
import IdReducer from './id';

const allReducers = combineReducers({
  loggedIn: loggedInReducer,
  firstName: firstNameReducer,
  signUpTop: signUpTopReducer,
  loginTop: loginTopReducer,
  createBtn: createBtnReducer,
  loadingImage: loadingImageReducer,
  error: errorReducer,
  loginData: loginDataReducer,
  listObject: listObjectReducer,
  selectedList: selectedListReducer,
  selectedItem: selectedItemReducer,
  navButtonDisplay: navButtonDisplayReducer,
  navButton: navButtonReducer,
  id: IdReducer,
  form: formReducer,
});

export default allReducers;
