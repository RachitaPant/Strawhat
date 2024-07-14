import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import Profile from './screens/Profile';
import {Image} from 'react-native';
const homeName = 'Home';
const profileName = 'Profile';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={Home} name="HomeScreen"></Stack.Screen>
      <Stack.Screen component={Profile} name="Profile"></Stack.Screen>
    </Stack.Navigator>
  );
};
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveBackgroundColor: 'black',
        tabBarInactiveBackgroundColor: 'black',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          padding: 10,
          height: 70,
          backgroundColor: 'black',
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {paddingBottom: 10, fontSize: 10},
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused
              ? require('./assets/images/community.png')
              : require('./assets/images/community.png');
          } else if (rn === profileName) {
            iconName = focused
              ? require('./assets/images/community.png')
              : require('./assets/images/community.png');
          }
          // You can return any component that you like here!
          return <Image source={iconName} style={{width: 25, height: 25}} />;
        },
      })}>
      <Tab.Screen name={homeName} component={HomeStack} />
      <Tab.Screen name={profileName} component={Profile} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
