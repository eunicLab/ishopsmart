import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  sendSelectedItem,
  sendNavButton,
  sendSelectedList,
  sendListObject,
} from '../actions';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Menu, { MenuItem } from 'react-native-material-menu';
import MenuIcon from 'react-native-vector-icons/Entypo';

let OneItem = (props) => {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.selectedItem);
  const selectedList = useSelector((state) => state.selectedList);
  const listObject = useSelector((state) => state.listObject);
  const loginData = useSelector((state) => state.loginData);
  const id = useSelector((state) => state.id);

  const [listItem, setListItem] = useState(styles.listItem);

  const [listItemChecked, setListItemChecked] = useState(
    styles.listItemChecked
  );

  let _menu = null;
  let setMenuRef = (ref) => {
    _menu = ref;
  };

  let showMenu = () => {
    _menu.show();
    dispatch(
      sendSelectedItem({
        id: props.item.id,
        item: props.item.item,
        price: props.item.price,
        checked: props.item.checked,
        sorted: props.item.sorted,
      })
    );
    setListItem(styles.listItemSelected);
    setListItemChecked(styles.listItemSelectedChecked);
  };
  let hideMenu = () => {
    _menu.hide();
  };

  let optionEditClick = () => {
    _menu.hide();
    props.navigateEdit();
  };
  let optionDeleteClick = () => {
    _menu.hide();
    props.removeItemHandler();
  };

  return (
    <View style={props.item.checked ? listItemChecked : listItem}>
      <MyCheck
        checked={props.item.checked}
        item={props.item.item}
        price={props.item.price}
        id={props.item.id}
        selectedList={selectedList}
        listObject={listObject}
        listId={id}
        loginData={loginData}
      />
      <View style={styles.item}>
        <Text style={props.item.checked ? styles.ashColor : styles.black}>
          {props.item.item}
        </Text>
      </View>
      <View
        style={styles.price}
        onStartShouldSetResponder={() => {
          if (selectedItem.id === props.item.id) {
            dispatch(
              sendSelectedItem({
                id: '',
                item: '',
                price: 0,
                sorted: '',
              })
            );
            dispatch(sendNavButton(false));
          } else {
            dispatch(
              sendSelectedItem({
                id: props.item.id,
                item: props.item.item,
                price: props.item.price,
                checked: props.item.checked,
                sorted: props.item.sorted,
              })
            );
            dispatch(sendNavButton(true));
          }
        }}>
        <Text
          className='price'
          style={props.item.checked ? styles.ashColor : styles.black}>
          {props.item.price > 0 ? props.item.price : ''}
        </Text>
      </View>
      <View style={styles.menustyle}>
        <Menu
          ref={setMenuRef}
          button={
            <TouchableOpacity onPress={showMenu}>
              <MenuIcon
                name='dots-three-vertical'
                size={20}
                color={props.item.checked ? '#B2BEB5' : 'black'}
              />
            </TouchableOpacity>
          }
          onHidden={() => {
            setListItem(styles.listItem);
            setListItemChecked(styles.listItemChecked);
          }}>
          <MenuItem onPress={optionEditClick}>Edit</MenuItem>
          <MenuItem onPress={optionDeleteClick}>Delete</MenuItem>
        </Menu>
      </View>
    </View>
  );
};
export default OneItem;

let MyCheck = (props) => {
  const dispatch = useDispatch();
  var currentListObject = props.listObject;
  let clickCheck = () => {
    dispatch(
      sendSelectedList({
        id: props.selectedList.id,
        title: props.selectedList.title,
        budget: props.selectedList.budget,
        list: [
          ...props.selectedList.list.filter((number) => number.id !== props.id),
          {
            item: props.item,
            id: props.id,
            price: props.price,
            checked: !props.checked,
            sorted: props.checked ? 'false' : 'true',
          },
        ],
      })
    );
    for (let i in props.listObject) {
      if (props.listObject[i].id === props.selectedList.id) {
        currentListObject[i] = {
          id: props.selectedList.id,
          title: props.selectedList.title,
          budget: props.selectedList.budget,
          list: [
            ...props.listObject[i].list.filter(
              (number) => number.id !== props.id
            ),
            {
              item: props.item,
              id: props.id,
              price: props.price,
              checked: !props.checked,
              sorted: props.checked ? 'false' : 'true',
            },
          ],
        };
      }
    }

    if (props.loginData.token !== '') {
      return (
        axios
          .put(
            'https://shopsmart1234.herokuapp.com/api/stuff/' + props.listId,
            {
              listObject: currentListObject,
            },
            {
              headers: { Authorization: `Bearer ${props.loginData.token}` },
            }
          )
          .then((res) => {
            console.log('updated successfully');
          }),
        dispatch(sendListObject(currentListObject)),
        AsyncStorage.setItem('user', JSON.stringify(currentListObject))
      );
    } else {
      dispatch(sendListObject(currentListObject)),
        AsyncStorage.setItem('user', JSON.stringify(currentListObject));
    }
  };
  const check = <Icon name='check' size={30} color='rgb(19, 153, 15)' />;
  if (props.checked === false) {
    return (
      <View
        style={styles.checkbox}
        onStartShouldSetResponder={clickCheck}></View>
    );
  } else
    return (
      <View style={styles.checkbox2} onStartShouldSetResponder={clickCheck}>
        {check}
      </View>
    );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    margin: '2%',
  },

  listItemSelected: {
    flex: 1,
    flexDirection: 'row',
    margin: '2%',
    padding: '3%',
    backgroundColor: 'rgb(189, 211, 182)',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    margin: '2%',
    padding: '3%',
    backgroundColor: 'white',
  },

  listItemSelectedChecked: {
    flex: 1,
    flexDirection: 'row',
    padding: '3%',
    margin: '2%',
    backgroundColor: 'rgb(189, 211, 182)',
  },

  ashColor: {
    color: '#B2BEB5',
  },

  blackColor: {
    color: 'black',
  },

  listItemChecked: {
    flex: 1,
    flexDirection: 'row',
    padding: '3%',
    margin: '2%',
  },

  item: {
    flex: 0.55,
  },
  price: {
    flex: 0.2,
    marginLeft: 0.05,
  },
  checkbox: {
    flex: 0.08,
    borderColor: 'rgb(19, 153, 15)',
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
  menustyle: {
    flex: 0.1,
    marginRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
