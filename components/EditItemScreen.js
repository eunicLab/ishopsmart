import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  sendListObject,
  sendSelectedList,
  sendSelectedItem,
  sendNavButton,
} from '../actions';
import axios from 'axios';
import { AdMobBanner } from 'expo-ads-admob';

let EditScreen = ({ navigation }) => {
  const selectedList = useSelector((state) => state.selectedList);
  const selectedItem = useSelector((state) => state.selectedItem);
  const [listItem, setListItem] = useState(selectedItem.item);
  const [listPrice, setListPrice] = useState(selectedItem.price);
  const listObject = useSelector((state) => state.listObject);
  const loginData = useSelector((state) => state.loginData);
  var currentListObject = listObject;
  const id = useSelector((state) => state.id);
  const dispatch = useDispatch();

  let handleListItem = (enteredText) => {
    setListItem(enteredText);
  };

  let handleItemPrice = (enteredText) => {
    enteredText > 0 ? setListPrice(enteredText) : setListPrice(0);
  };

  let editItemHandler = () => {
    var itemSelected = selectedItem;
    dispatch(
      sendSelectedItem({
        id: '',
        item: '',
        price: 0,
        checked: false,
        sorted: 'false',
      })
    );
    dispatch(sendNavButton(false));
    dispatch(
      sendSelectedList({
        id: selectedList.id,
        title: selectedList.title,
        budget: selectedList.budget,
        list: [
          ...selectedList.list.filter(
            (number) => number.id !== itemSelected.id
          ),
          {
            item: listItem,
            id: itemSelected.id,
            price: listPrice,
            checked: itemSelected.checked,
            sorted: itemSelected.sorted,
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
            ...listObject[i].list.filter(
              (number) => number.id !== selectedItem.id
            ),
            {
              item: listItem,
              id: selectedItem.id,
              price: listPrice,
              checked: itemSelected.checked,
              sorted: itemSelected.sorted,
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
        AsyncStorage.setItem('user', JSON.stringify(currentListObject)),
        navigation.navigate('Items')
      );
    } else {
      return (
        dispatch(sendListObject(currentListObject)),
        AsyncStorage.setItem('user', JSON.stringify(currentListObject)),
        navigation.navigate('Items')
      );
    }
  };

  return (
    <View>
      <View style={styles.edit}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          value={listItem}
          style={styles.item}
          onChangeText={handleListItem}
        />
        <Text style={styles.label}>Price</Text>
        <TextInput
          value={listPrice.toString()}
          style={styles.price}
          onChangeText={handleItemPrice}
          keyboardType={'numeric'}
        />
        <View style={styles.doneButton}>
          <Text
            style={styles.white}
            onStartShouldSetResponder={editItemHandler}>
            Done
          </Text>
        </View>
      </View>
      <AdMobBanner
        bannerSize='fullBanner'
        adUnitID='ca-app-pub-4627798042390839/2119115541' // Test ID, Replace with your-admob-unit-id
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
  item: {
    borderColor: 'blue',
    borderBottomWidth: 2,
    marginBottom: 30,
    padding: 10,
    width: '90%',
    height: 40,
  },
  price: {
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
