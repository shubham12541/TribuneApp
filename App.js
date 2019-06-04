import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';
import SettingScreen from './SettingScreen';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Detail: {screen: DetailScreen},
  Settings: {screen: SettingScreen}
},{
  initialRouteName: 'Home'
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
