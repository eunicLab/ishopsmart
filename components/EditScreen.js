import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  sendListObject,
  sendSelectedList,
  sendNavButtonDisplay,
} from '../actions';
import axios from 'axios';
import { AdMobBanner } from 'expo-ads-admob';

let EditScreen = ({ navigation }) => {
  const selectedList = useSelector((state) => state.selectedList);
  const [listTitle, setListTitle] = useState(selectedList.title);
  const [listBudget, setListBudget] = useState(selectedList.budget);
  const listObject = useSelector((state) => state.listObject);
  const loginData = useSelector((state) => state.loginData);
  var currentListObject = listObject;
  const id = useSelector((state) => state.id);
  const dispatch = useDispatch();

  let handleListTitle = (enteredText) => {
    setListTitle(enteredText);
  };

  let handleListBudget = (enteredText) => {
    enteredText > 0 ? setListBudget(enteredText) : setListBudget(0);
  };

  let editTitleHandler = () => {
    var listSelected = selectedList;
    dispatch(
      sendSelectedList({
        id: '',
        title: '',
        list: [],
        budget: 0,
      })
    );
    dispatch(sendNavButtonDisplay(false));
    for (let i in listObject) {
      if (listObject[i].id === listSelected.id) {
        currentListObject[i] = {
          id: listSelected.id,
          title: listTitle,
          list: listSelected.list,
          budget: listBudget,
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
          .then(
            (res) => {
              console.log('updated successfully');
            },
            (error) => {
              console.log('couldn not edit');
            }
          ),
        dispatch(sendListObject(currentListObject)),
        AsyncStorage.setItem('user', JSON.stringify(currentListObject)),
        navigation.navigate('My Lists')
      );
    } else {
      return (
        dispatch(sendListObject(currentListObject)),
        AsyncStorage.setItem('user', JSON.stringify(currentListObject)),
        navigation.navigate('My Lists')
      );
    }
  };

  return (
    <View>
      <View style={styles.edit}>
        <Text style={styles.label}>List Name</Text>
        <TextInput
          value={listTitle}
          style={styles.title}
          onChangeText={handleListTitle}
        />
        <Text style={styles.label}>Budget</Text>
        <TextInput
          value={listBudget.toString()}
          style={styles.budget}
          onChangeText={handleListBudget}
          keyboardType={'numeric'}
        />
        <View style={styles.doneButton}>
          <Text
            style={styles.white}
            onStartShouldSetResponder={editTitleHandler}>
            Done
          </Text>
        </View>
      </View>

      <AdMobBanner
        bannerSize='fullBanner'
        adUnitID='ca-app-pub-4627798042390839/7794006257' // Test ID, Replace with your-admob-unit-id
        onDidFailToReceiveAdWithError={this.bannerError}
      />
    </View>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  edit: {
    margin: '10%',
  },
  title: {
    borderColor: 'blue',
    borderBottomWidth: 2,
    marginBottom: 30,
    padding: 10,
    width: '90%',
    height: 40,
  },
  budget: {
    borderColor: 'blue',
    borderBottomWidth: 2,
    marginBottom: 30,
    padding: 10,
    width: '90%',
    height: 40,
  },
  label: {
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: 'rgb(16,130,13)',
    padding: 10,
    justifyContent: 'center',
    color: 'white',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: '50%',
    width: '30%',
  },
  white: {
    color: 'white',
    fontWeight: 'bold',
  },
});
