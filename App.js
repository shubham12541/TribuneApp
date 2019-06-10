import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';

import Icon from './IconComponent';
import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';
import SettingScreen from './SettingScreen';
import SavedStoriesScreen from './SavedStoriesScreen';

const HomeStack = createStackNavigator({
  Home: {screen: HomeScreen},
  Detail: {screen: DetailScreen},
  Settings: {screen: SettingScreen}
},{
  initialRouteName: 'Home'
});

const SavedStoriesStack = createStackNavigator({
	SavedStories: {screen: SavedStoriesScreen},
	SavedDetail: {screen: DetailScreen}
}, {
	initialRouteName: 'SavedStories'
})

const TabNavigator = createBottomTabNavigator({
	Home: HomeStack,
	SavedStories: SavedStoriesStack
}, {
	defaultNavigationOptions: ({navigation}) => ({
		tabBarIcon: ({focused, horizontal, tintColor}) => {
			const { routeName } = navigation.state;

			return <Icon size={25} name={routeName === "Home" ? "home" : "bookmarks" } color={tintColor} />
		},
		tabBarLabel: ({}) => {
			const {routeName} = navigation.state;

			return <Text>{routeName === "Home" ? "Home" : "Saved Stories" }</Text>;
		}
	})
});

const AppContainer = createAppContainer(TabNavigator);


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
