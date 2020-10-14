import * as React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import allReducer from './reducers';
import LoginScreen from './components/LoginScreen';
import MyListsScreen from './components/MyListsScreen';
import EditScreen from './components/EditScreen';
import EditItemScreen from './components/EditItemScreen';
import ItemsScreen from './components/ItemsScreen';
import PrivacyScreen from './components/PrivacyScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

const store = createStore(allReducer);

let App = ({ navigation }) => {
  function Title({ value }) {
    const Remainder = () => {
      let total = 0;
      for (let i in value.list) {
        total += parseFloat(value.list[i].price);
      }
      return total;
    };

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 20,
        }}>
        <View style={{ flex: 0.7 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
            {value.title}
          </Text>
        </View>
        <View style={{ flex: 0.3 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
            {Remainder() !== 0 ? Remainder() : ''}
            {Remainder() !== 0 ? '/' : value.budget !== 0 ? '/' : ''}
            {value.budget !== 0 ? value.budget : ''}
          </Text>
        </View>
      </View>
    );
  }
  const TitleContainer = connect((state) => ({
    value: state.selectedList,
  }))(Title);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='My Lists'
            component={MyListsScreen}
            options={({ navigation }) => ({
              headerTitle: 'My Lists',
              headerRight: () => (
                <View style={{ marginRight: 20 }}>
                  <Icon
                    name='user'
                    size={30}
                    color='white'
                    onPress={() => navigation.navigate('Login')}
                  />
                </View>
              ),
              headerStyle: {
                backgroundColor: 'rgb(16,130,13)',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          />

          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{
              title: '',
              headerStyle: { backgroundColor: 'rgb(16,130,13)' },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
              },
            }}
          />

          <Stack.Screen
            name='Items'
            component={ItemsScreen}
            options={{
              headerTitle: () => <TitleContainer />,
              headerStyle: {
                backgroundColor: 'rgb(16,130,13)',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
              },
            }}
          />
          <Stack.Screen
            name='Edit Title'
            component={EditScreen}
            options={{
              title: 'Edit',
              headerStyle: {
                backgroundColor: 'rgb(16,130,13)',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name='Edit Item'
            component={EditItemScreen}
            options={{
              title: 'Edit',
              headerStyle: {
                backgroundColor: 'rgb(16,130,13)',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name='Privacy Policy'
            component={PrivacyScreen}
            options={{
              title: 'Privacy Policy',
              headerStyle: {
                backgroundColor: 'rgb(16,130,13)',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
