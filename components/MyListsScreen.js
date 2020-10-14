import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import TitleList from './TitleList';
import { useSelector, useDispatch } from 'react-redux';
import {
  sendListObject,
  sendSelectedList,
  loggedIn,
  sendLoginData,
  sendId,
  sendNavButtonDisplay,
} from '../actions';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import { AdMobBanner } from 'expo-ads-admob';

let MyListsScreen = ({ navigation }) => {
  const selectedList = useSelector((state) => state.selectedList);
  const listObject = useSelector((state) => state.listObject);
  const loginData = useSelector((state) => state.loginData);
  const id = useSelector((state) => state.id);
  const navButtonDisplay = useSelector((state) => state.navButtonDisplay);
  const [listTitle, setListTitle] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    loadLoginCredentials();
  }, []);

  let displayData = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(user);
      user === undefined || null || parsed === null
        ? AsyncStorage.setItem('user', JSON.stringify(listObject))
        : dispatch(sendListObject(parsed));
    } catch (error) {
      alert(error);
    }
  };

  let loadLoginCredentials = async () => {
    try {
      let credentials = await AsyncStorage.getItem('credentials');
      let parsed = JSON.parse(credentials);
      if (credentials === undefined || null) {
        displayData();
        alert('could not log in');
      } else {
        axios
          .post('https://shopsmart1234.herokuapp.com/api/auth/login', {
            email: parsed.email,
            password: parsed.password,
          })
          .then(
            (response) => {
              dispatch(loggedIn(true));
              dispatch(
                sendLoginData({
                  email: parsed.email,
                  token: response.data.token,
                })
              );
              var api = 'https://shopsmart1234.herokuapp.com/api/stuff';
              axios
                .get(api, {
                  params: {
                    email: parsed.email,
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
                });
            },
            (error) => {
              console.log('could not login');
              alert('could not login');
            }
          );
      }
    } catch (error) {
      alert(
        'Click on the profile icon to sign in to enable more features such as getting your lists on multiple devices '
      );

      displayData();
    }
  };

  let handleListTitle = (enteredText) => {
    setListTitle(enteredText);
  };

  let saveData = () => {
    let obj = [
      ...listObject,
      {
        title: listTitle,
        id: idRandom,
        budget: 0,
        list: [],
      },
    ];
    AsyncStorage.setItem('user', JSON.stringify(obj));
  };

  var idRandom = Math.random().toString();
  const addTitleHandler = () => {
    if (listTitle !== '') {
      dispatch(
        sendListObject([
          ...listObject,
          {
            title: listTitle,
            id: idRandom,
            budget: 0,
            list: [],
          },
        ])
      );

      saveData();

      setListTitle('');
      var backendObject = {
        listObject: [
          ...listObject,
          {
            title: listTitle,
            id: idRandom,
            budget: 0,
            list: [],
          },
        ],
      };

      if (loginData.token !== '') {
        axios
          .put(
            'https://shopsmart1234.herokuapp.com/api/stuff/' + id,
            backendObject,
            {
              headers: { Authorization: `Bearer ${loginData.token}` },
            }
          )
          .then((res) => {
            console.log('updated successfully');
          });
      }
    }
  };

  const removeTitleHandler = () => {
    var backendObject = listObject.filter(
      (number) => number.id !== selectedList.id
    );
    dispatch(sendListObject(backendObject));
    AsyncStorage.setItem('user', JSON.stringify(backendObject));
    dispatch(
      sendSelectedList({
        id: '',
        title: '',
        list: [],
        budget: 0,
      })
    );
    dispatch(sendNavButtonDisplay(false));
    if (loginData.token !== '') {
      axios
        .put(
          'https://shopsmart1234.herokuapp.com/api/stuff/' + id,
          { listObject: backendObject },
          {
            headers: { Authorization: `Bearer ${loginData.token}` },
          }
        )
        .then((res) => {
          console.log('updated successfully');
        });
    }
  };
  const ListOfTitles = listObject.map((item) => (
    <TitleList
      item={item}
      key={item.id}
      navigateEdit={() => navigation.navigate('Edit Title')}
      navigateOpen={() => navigation.navigate('Items')}
      removeTitleHandler={removeTitleHandler}
    />
  ));
  const OpenFolder = <Icon name='folderopen' size={30} color='white' />;
  const Delete = <DeleteIcon name='delete' size={30} color='white' />;
  const Edit = <Icon name='edit' size={30} color='white' />;

  return (
    <View>
      <View style={styles.adStyle}>
        <AdMobBanner
          bannerSize='fullBanner'
          adUnitID='ca-app-pub-4627798042390839/6611241934' // Test ID, Replace with your-admob-unit-id
          onDidFailToReceiveAdWithError={this.bannerError}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.textInputView}>
          <TextInput
            placeholder='New List'
            style={styles.input}
            onChangeText={handleListTitle}
            value={listTitle}
            onSubmitEditing={addTitleHandler}
          />
        </View>
        <View
          style={styles.addButton}
          onStartShouldSetResponder={addTitleHandler}>
          <Text style={styles.white}>Create</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll}>{ListOfTitles}</ScrollView>
    </View>
  );
};
export default MyListsScreen;

let Footer = (props) => {
  if (props.navButtonDisplay === false) {
    return null;
  } else
    return (
      <View style={styles.footer}>
        <View
          style={styles.openfolder}
          onStartShouldSetResponder={props.navigateDetail}>
          {props.OpenFolder}
        </View>
        <View
          style={styles.edit}
          onStartShouldSetResponder={props.navigateEdit}>
          {props.Edit}
        </View>
        <View
          style={styles.delete}
          onStartShouldSetResponder={props.removeTitleHandler}>
          {props.Delete}
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '15%',
    marginTop: '5%',
  },

  textInputView: {
    flex: 0.85,
  },

  column: {
    flex: 1,
  },
  input: {
    borderColor: 'blue',
    borderBottomWidth: 2,
    marginBottom: 10,
    padding: 10,
    width: '95%',
    height: 48,
  },
  addButton: {
    flex: 0.15,
    padding: 20,
    borderColor: 'rgb(16,130,13)',
    backgroundColor: 'rgb(16,130,13)',
    justifyContent: 'center',
    color: 'white',
    height: '8%',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  white: { color: 'white', fontWeight: 'bold' },
  scroll: { height: '75%', marginTop: '5%' },

  adStyle: {
    height: '8%',
  },
  delete: {
    flex: 0.2,
  },
  openfolder: {
    flex: 0.4,
  },
  edit: {
    flex: 0.4,
  },
});
