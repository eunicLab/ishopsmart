import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { reduxForm } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  loggedIn,
  errorSignUpFailed,
  errorLoginFailed,
  errorFieldEmpty,
  noError,
  sendLoginData,
  sendListObject,
  sendId,
  errorPrivacyPolicy,
} from '../actions';
import axios from 'axios';

let LoginForm = ({ navigation }) => {
  const logIn = useSelector((state) => state.loggedIn);
  const loginData = useSelector((state) => state.loginData);
  const error = useSelector((state) => state.error);
  const [signUpTop, setSignUpTop] = useState('buttonTopActive');
  const [loginTop, setLoginTop] = useState('buttonTop');
  const [toggleCheckBox, setValueCheckbox] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const dispatch = useDispatch();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredName, setEnteredName] = useState('');
  const listObject = useSelector((state) => state.listObject);
  const nameInputHandler = (enteredText) => {
    setEnteredName(enteredText);
  };

  const privacyHandler = () => {
    navigation.navigate('Privacy Policy');
  };

  const emailInputHandler = (enteredText) => {
    setEnteredEmail(enteredText);
  };

  const passwordInputHandler = (enteredText) => {
    setEnteredPassword(enteredText);
  };

  const user = 'user';
  const credentials = 'credentials';

  const logOut = () => {
    dispatch(loggedIn(false));
    dispatch(
      sendLoginData({
        email: '',
        token: '',
      })
    );

    dispatch(sendListObject([]));

    async function removeItemValue(user) {
      try {
        await AsyncStorage.removeItem(user);
        return true;
      } catch (exception) {
        return false;
      }
    }
    removeItemValue(user);

    async function removeLoginCredentials(credentials) {
      try {
        await AsyncStorage.removeItem(credentials);
        return true;
      } catch (exception) {
        return false;
      }
    }
    removeLoginCredentials(credentials);
  };

  var tokenData;
  const loginSubmit = () => {
    if (signUpTop === 'buttonTop') {
      if (enteredEmail === '' || enteredPassword === '') {
        dispatch(errorFieldEmpty());
      } else {
        setLoadingImage(true);

        axios
          .post('https://shopsmart1234.herokuapp.com/api/auth/login', {
            email: enteredEmail.toLowerCase(),
            password: enteredPassword,
          })
          .then(
            (response) => {
              dispatch(loggedIn(true));
              setLoadingImage(false);
              dispatch(noError());
              navigation.navigate('My Lists');
              dispatch(
                sendLoginData({
                  email: enteredEmail.toLowerCase(),
                  token: response.data.token,
                })
              );

              tokenData = response.data.token;

              AsyncStorage.setItem(
                'credentials',
                JSON.stringify({
                  email: enteredEmail.toLowerCase(),
                  password: enteredPassword,
                })
              );

              var api = 'https://shopsmart1234.herokuapp.com/api/stuff';
              axios
                .get(api, {
                  params: {
                    email: enteredEmail.toLowerCase(),
                  },
                  headers: { Authorization: `Bearer ${response.data.token}` },
                })
                .then((response) => {
                  let b = response.data[0].listObject;
                  let a = listObject;

                  function arrayDiff(a, b) {
                    a = a.filter(function (el) {
                      return !b.includes(el);
                    });
                    return a;
                  }

                  arrayDiff(a, b);

                  dispatch(
                    sendListObject(response.data[0].listObject.concat(a))
                  );

                  AsyncStorage.setItem(
                    'user',
                    JSON.stringify(response.data[0].listObject.concat(a))
                  );
                  dispatch(sendId(response.data[0]._id));

                  axios
                    .put(
                      'https://shopsmart1234.herokuapp.com/api/stuff/' +
                        response.data[0]._id,
                      { listObject: response.data[0].listObject.concat(a) },
                      {
                        headers: {
                          Authorization: `Bearer ${tokenData}`,
                        },
                      }
                    )
                    .then((res) => {
                      console.log('updated successfully');
                    });
                });
            },
            (error) => {
              console.log('could not login');
              dispatch(errorLoginFailed());
              setLoadingImage(false);
            }
          );
      }
    }
    if (signUpTop === 'buttonTopActive') {
      var firstPost = {
        id: '',
        listObject: listObject,
        email: enteredEmail.toLowerCase(),
        username: enteredName,
      };

      var api2 = 'https://shopsmart1234.herokuapp.com/api/stuff';

      var api1 = 'https://shopsmart1234.herokuapp.com/api/auth/signup';
      if (enteredEmail === '' || enteredPassword === '' || enteredName === '') {
        dispatch(errorFieldEmpty());
      } else {
        if (toggleCheckBox === false) {
          dispatch(errorPrivacyPolicy());
        } else {
          setLoadingImage(true);
          axios
            .post(api1, {
              email: enteredEmail.toLowerCase(),
              password: enteredPassword,
            })
            .then(
              (response) => {
                axios
                  .post('https://shopsmart1234.herokuapp.com/api/auth/login', {
                    email: enteredEmail.toLowerCase(),
                    password: enteredPassword,
                  })
                  .then((response) => {
                    dispatch(loggedIn(true));
                    setLoadingImage(false);
                    dispatch(noError());
                    navigation.navigate('My Lists');
                    dispatch(
                      sendLoginData({
                        email: enteredEmail,
                        token: response.data.token,
                      })
                    );
                    axios.post(api2, firstPost, {
                      headers: {
                        Authorization: `Bearer ${response.data.token}`,
                      },
                    });

                    AsyncStorage.setItem('user', JSON.stringify(firstPost));

                    AsyncStorage.setItem(
                      'credentials',
                      JSON.stringify({
                        email: enteredEmail.toLowerCase(),
                        password: enteredPassword,
                      })
                    );
                  });
              },
              (error) => {
                dispatch(errorSignUpFailed());
                setLoadingImage(false);
              }
            );
        }
      }
    }
  };

  return !logIn ? (
    <View>
      <View>
        <View style={styles.row}>
          <View
            style={
              signUpTop === 'buttonTopActive'
                ? styles.buttonTopActive
                : styles.buttonTop
            }
            onStartShouldSetResponder={() => {
              setSignUpTop('buttonTopActive');
              setLoginTop('buttonTop');
              dispatch(noError());
            }}>
            <Text
              style={
                signUpTop === 'buttonTopActive' ? styles.white : styles.black
              }>
              Sign Up
            </Text>
          </View>

          <View
            style={
              loginTop === 'buttonTopActive'
                ? styles.buttonTopActive
                : styles.buttonTop
            }
            onStartShouldSetResponder={() => {
              setLoginTop('buttonTopActive');
              setSignUpTop('buttonTop');
              dispatch(noError());
            }}>
            <Text
              style={
                loginTop === 'buttonTopActive' ? styles.white : styles.black
              }>
              Login
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.error}>{error}</Text>
      <View style={styles.form}>
        <MyView nameInputHandler={nameInputHandler} signUpTop={signUpTop} />
        <TextInput
          placeholder='Email'
          style={styles.input}
          onChangeText={emailInputHandler}
        />

        <LoadingImage loadingImage={loadingImage} />

        <TextInput
          placeholder='Password'
          style={styles.input}
          onChangeText={passwordInputHandler}
          secureTextEntry={true}
        />

        <Privacy
          privacyHandler={privacyHandler}
          signUpTop={signUpTop}
          toggleCheckBox={toggleCheckBox}
          handleCheckboxTrue={() => setValueCheckbox(true)}
          handleCheckboxFalse={() => setValueCheckbox(false)}
        />

        <View
          style={styles.submitLogin}
          onStartShouldSetResponder={loginSubmit}>
          <Text style={styles.white2}>
            {signUpTop === 'buttonTopActive' ? 'Create Account' : 'Login'}
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.logOutScreen}>
      <Text style={styles.logOutText}> Signed in as</Text>
      <Text style={styles.logOutText}>{loginData.email}</Text>

      <View style={styles.submitLogin} onStartShouldSetResponder={logOut}>
        <Text style={styles.white}>LOG OUT</Text>
      </View>
    </View>
  );
};

export default reduxForm({ form: 'loginAndSignUp' })(LoginForm);

let MyView = (props) => {
  if (props.signUpTop === 'buttonTop') {
    return null;
  } else
    return (
      <TextInput
        placeholder='First Name'
        style={styles.input}
        onChangeText={props.nameInputHandler}
      />
    );
};

let Privacy = (props) => {
  if (props.signUpTop === 'buttonTop') {
    return null;
  } else
    return (
      <View style={styles.privacyPolicy}>
        <MyCheck
          handleCheckboxFalse={props.handleCheckboxFalse}
          handleCheckboxTrue={props.handleCheckboxTrue}
          toggleCheckBox={props.toggleCheckBox}
        />
        <View
          style={styles.policywriting}
          onStartShouldSetResponder={props.privacyHandler}>
          <Text>
            I acknowledge that I have read and agree to the{' '}
            <Text style={styles.link}>Privacy Policy.</Text>
          </Text>
        </View>
      </View>
    );
};

let LoadingImage = (props) => {
  if (props.loadingImage === true) {
    return (
      <View style={styles.loadingImage}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  } else return null;
};

let MyCheck = (props) => {
  const check = <Icon name='check' size={30} color='rgb(16,130,13)' />;
  if (props.toggleCheckBox === false) {
    return (
      <View
        style={styles.checkbox}
        onStartShouldSetResponder={props.handleCheckboxTrue}></View>
    );
  } else
    return (
      <View
        style={styles.checkbox2}
        onStartShouldSetResponder={props.handleCheckboxFalse}>
        {check}
      </View>
    );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },

  buttonTop: {
    flex: 0.5,
    padding: 30,
    backgroundColor: '#dfe7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonTopActive: {
    flex: 0.5,
    padding: 30,
    backgroundColor: 'rgb(16,130,13)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  black: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  white: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  white2: {
    color: 'white',
    fontWeight: 'bold',
  },

  form: {
    marginTop: '5%',
  },
  input: {
    marginTop: '5%',
    marginLeft: '10%',
    borderColor: 'black',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    marginBottom: 2,
    padding: 10,
    width: '80%',
    height: 50,
  },
  submitLogin: {
    padding: '5%',
    backgroundColor: 'rgb(16,130,13)',
    marginTop: '15%',
    marginLeft: '20%',
    marginRight: '20%',
    alignItems: 'center',
    borderRadius: 10,
  },
  error: {
    marginTop: '30%',
    textAlign: 'center',
    color: 'red',
  },
  loadingImage: {
    position: 'absolute',
    left: '44%',
    top: '26%',
    zIndex: 1,
  },
  privacyPolicy: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '5%',
    flex: 1,
    flexDirection: 'row',
  },
  policywriting: {
    flex: 0.9,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  checkbox: {
    flex: 0.08,
    borderColor: 'rgb(16,130,13)',
    borderWidth: 2,
    marginRight: '10%',
    height: 22,
    borderRadius: 3,
  },
  checkbox2: {
    flex: 0.1,
    marginRight: '10%',
    height: 22,
  },
  logOutText: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
  logOutScreen: {
    marginTop: '25%',
  },
});
