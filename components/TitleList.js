import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { sendSelectedList } from '../actions';
import Menu, { MenuItem } from 'react-native-material-menu';
import MenuIcon from 'react-native-vector-icons/Entypo';

let TitleList = (props) => {
  const selectedList = useSelector((state) => state.selectedList);
  const dispatch = useDispatch();
  const [highlightSelected, setHighlightSelected] = useState(styles.listTitle);

  let _menu = null;
  let setMenuRef = (ref) => {
    _menu = ref;
  };

  let showMenu = () => {
    _menu.show();
    dispatch(
      sendSelectedList({
        id: props.item.id,
        title: props.item.title,
        list: props.item.list,
        budget: props.item.budget,
      })
    );
    setHighlightSelected(styles.listTitleSelected);
  };
  let hideMenu = () => {
    _menu.hide();
  };
  let optionOpenClick = () => {
    _menu.hide();
    props.navigateOpen();
  };
  let optionEditClick = () => {
    _menu.hide();
    props.navigateEdit();
  };
  let optionDeleteClick = () => {
    _menu.hide();
    props.removeTitleHandler();
  };

  return (
    <View style={highlightSelected}>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text>{props.item.title}</Text>
        </View>
        <View style={styles.budget}>
          <Text>{props.item.budget > 0 ? props.item.budget : ''}</Text>
        </View>
        <View style={styles.menustyle}>
          <Menu
            ref={setMenuRef}
            button={
              <TouchableOpacity onPress={showMenu}>
                <MenuIcon name='dots-three-vertical' size={20} color='black' />
              </TouchableOpacity>
            }
            onHidden={() => {
              setHighlightSelected(styles.listTitle);
            }}>
            <MenuItem onPress={optionOpenClick}>Open</MenuItem>
            <MenuItem onPress={optionEditClick}>Edit</MenuItem>
            <MenuItem onPress={optionDeleteClick}>Delete</MenuItem>
          </Menu>
        </View>
      </View>
    </View>
  );
};
export default TitleList;
const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    margin: '2%',
    padding: '2%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  listTitleSelected: {
    margin: '2%',
    padding: '2%',
    backgroundColor: 'rgb(189, 211, 182)',
  },
  listTitle: {
    margin: '2%',
    padding: '2%',
    backgroundColor: 'white',
  },
  title: {
    flex: 0.8,
  },
  budget: {
    flex: 0.2,
  },
  menustyle: {
    marginRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
