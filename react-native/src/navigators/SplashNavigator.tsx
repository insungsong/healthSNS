import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';

export type SplashNavigatorRouterParamsList = {};

const Stack = createStackNavigator();

const SplashNavigator = () => {
  console.log('SplashNavigator');
  return (
    <Stack.Navigator
      initialRouteName="MainScreen"
      screenOptions={{
        gesturesEnabled: false,
        // animationEnabled: false,
      }}
      navigationOptions={{
        headerLeft: null,
        gesturesEnabled: false,
      }}
      headerMode="none"
      // renderScene={(route, navigator) => <StatusBar />}
    >
      <Stack.Screen name="MainScreen" component={MainScreen} />
    </Stack.Navigator>
  );
};
// };

export default SplashNavigator;
