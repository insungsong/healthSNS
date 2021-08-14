import React from 'react';
import {Text, Image, StyleSheet, SafeAreaView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        backBehavior="initialRoute"
        tabBarOptions={{
          style: {
            backgroundColor: '#fff',
            height: 56,
            paddingTop: 8,
            paddingBottom: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}>
        {/* Home */}
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: () => {
              return <Text style={styles.title}>홈</Text>;
            },
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  style={styles.icon}
                  source={
                    focused
                      ? require('../../img/common/homeActiveIcon.png')
                      : require('../../img/common/homeIcon.png')
                  }
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  icon: {
    marginBottom: 4,
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 12,
    color: '#FD7B7B',
    textAlign: 'center',
  },
});

export default TabNavigator;
