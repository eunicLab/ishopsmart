import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  sendListObject,
  sendSelectedList,
  sendSelectedItem,
  sendNavButton,
} from '../actions';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import OneItem from './OneItem';
import { AdMobBanner } from 'expo-ads-admob';

let ItemsScreen = ({ navigation }, props) => {
  const selectedList = useSelector((state) => state.selectedList);
  const selectedItem = useSelector((state) => state.selectedItem);
  const [AllListItems, setAllListItems] = useState(selectedList.list);
  const listObject = useSelector((state) => state.listObject);
  const loginData = useSelector((state) => state.loginData);
  const id = useSelector((state) => state.id);
  const navButtonDisplay = useSelector((state) => state.navButton);

  const [listItem, setListItem] = useState('');

  let handleListItem = (enteredText) => {
    setListItem(enteredText);
  };
  const dispatch = useDispatch();

  var currentListObject = listObject;
  var listId = Math.random().toString();
  const addItemHandler = () => {
    if (listItem !== '') {
      setAllListItems((currentAllListItems) => [
        ...currentAllListItems,
        {
          item: listItem,
          id: listId,
          price: 0,
          checked: false,
          sorted: 'false',
        },
      ]);
      setListItem('');
      dispatch(
        sendSelectedList({
          id: selectedList.id,
          budget: selectedList.budget,
          title: selectedList.title,
          list: [
            ...selectedList.list,
            {
              item: listItem,
              id: listId,
              price: 0,
              checked: false,
              sorted: 'false',
            },
          ],
        })
      );

      for (let i in listObject) {
        if (listObject[i].id === selectedList.id) {
          currentListObject[i] = {
            id: selectedList.id,
            title: selectedList.title,
            budget: selectedList.budget,
            list: [
              ...selectedList.list,
              {
                item: listItem,
                id: listId,
                price: 0,
                checked: false,
                sorted: 'false',
              },
            ],
          };
        }
      }

      if (loginData.token !== '') {
        return (
          axios
            .put(
              'https://shopsmart1234.herokuapp.com/api/stuff/' + id,
              {
                listObject: currentListObject,
              },
              {
                headers: { Authorization: `Bearer ${loginData.token}` },
              }
            )
            .then((res) => {
              console.log('updated successfully');
            }),
          dispatch(sendListObject(currentListObject)),
          AsyncStorage.setItem('user', JSON.stringify(currentListObject))
        );
      } else {
        return (
          dispatch(sendListObject(currentListObject)),
          AsyncStorage.setItem('user', JSON.stringify(currentListObject))
        );
      }
    }
  };

  const removeItemHandler = () => {
    setAllListItems(() => {
      return selectedList.list.filter(
        (number) => number.id !== selectedItem.id
      );
    });
    dispatch(
      sendSelectedList({
        id: selectedList.id,
        title: selectedList.title,
        budget: selectedList.budget,
        list: selectedList.list.filter(
          (number) => number.id !== selectedItem.id
        ),
      })
    );
    dispatch(
      sendSelectedItem({
        id: '',
        item: '',
        price: 0,
        sorted: '',
      })
    );
    dispatch(sendNavButton(false));
    for (let i in listObject) {
      if (listObject[i].id === selectedList.id) {
        currentListObject[i] = {
          id: selectedList.id,
          title: selectedList.title,
          budget: selectedList.budget,
          list: selectedList.list.filter(
            (number) => number.id !== selectedItem.id
          ),
        };
      }
    }
    if (loginData.token !== '') {
      return (
        axios
          .put(
            'https://shopsmart1234.herokuapp.com/api/stuff/' + id,
            {
              listObject: currentListObject,
            },
            {
              headers: { Authorization: `Bearer ${loginData.token}` },
            }
          )
          .then((res) => {
            console.log('updated successfully');
          }),
        dispatch(sendListObject(currentListObject)),
        AsyncStorage.setItem('user', JSON.stringify(currentListObject))
      );
    } else {
      return (
        dispatch(sendListObject(currentListObject)),
        AsyncStorage.setItem('user', JSON.stringify(currentListObject))
      );
    }
  };

  function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    };
  }

  const ListOfItems = selectedList.list
    .sort(dynamicSort('item'))
    .sort(dynamicSort('sorted'))
    .map((item) => (
      <OneItem
        item={item}
        key={item.id}
        navigateEdit={() => navigation.navigate('Edit Item')}
        removeItemHandler={removeItemHandler}
      />
    ));

  const Delete = <DeleteIcon name='delete' size={30} color='white' />;
  const Edit = <Icon name='edit' size={30} color='white' />;

  return (
    <View>
      <View style={styles.adStyle}>
        <AdMobBanner
          bannerSize='fullBanner'
          adUnitID='ca-app-pub-4627798042390839/9572447193' // Test ID, Replace with your-admob-unit-id
          onDidFailToReceiveAdWithError={this.bannerError}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.textInputView}>
          <TextInput
            placeholder='Add Item'
            style={styles.input}
            onChangeText={handleListItem}
            value={listItem}
            onSubmitEditing={addItemHandler}
          />
        </View>
        <View
          style={styles.addButton}
          onStartShouldSetResponder={addItemHandler}>
          <Text style={styles.white}>Add </Text>
        </View>
      </View>
      <ScrollView style={styles.scroll}>{ListOfItems}</ScrollView>
    </View>
  );
};
export default ItemsScreen;

let Footer = (props) => {
  if (props.navButtonDisplay === false) {
    return null;
  } else
    return (
      <View style={styles.footer}>
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
    flex: 0.3,
  },

  edit: {
    flex: 0.6,
    marginLeft: '20%',
  },
});
