import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Profile from './screens/Profile';
import {Image} from 'react-native';
import Community from './screens/Community';
import LoginScreen from './screens/LoginScreen';
import SignUp from './screens/SignUp';
import auth from '@react-native-firebase/auth'; // Import the initialized auth from firebase.js
import HomeScreen from './screens/HomeScreen';

const homeName = 'Home';
const profileName = 'Profile';
const communityName = 'Community';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={HomeScreen} name="HomeScreen"></Stack.Screen>
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
        tabBarActiveBackgroundColor: '#a28be8',
        tabBarInactiveBackgroundColor: '#b5a6e0',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          padding: 0,
          height: 70,
          backgroundColor: '#a28be8',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarLabelStyle: {paddingBottom: 10, fontSize: 10},
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused
              ? require('./assets/images/home.png')
              : require('./assets/images/community.png');
          } else if (rn === communityName) {
            iconName = focused
              ? require('./assets/images/community.png')
              : require('./assets/images/community.png');
          }
          // You can return any component that you like here!
          return <Image source={iconName} style={{width: 25, height: 25}} />;
        },
      })}>
      <Tab.Screen name={homeName} component={HomeStack} />
      <Tab.Screen name={communityName} component={Community} />
    </Tab.Navigator>
  );
};
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={SignUp} name="SignUp" />
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    console.log('Initializing:', initializing);
    console.log('User:', user);
  }, [initializing, user]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log('on auth called');
    return subscriber;
    // unsubscribe on unmount
  }, []);

  if (initializing) {
    console.log('App initializing...');
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
