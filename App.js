import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';

import Weather from './screens/weather.js';
import Settings from './screens/settings.js';
import About from './screens/about.js';

const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarIcon: ({focused, size, colour}) => {
            let iconName;
            colour = '#d3dce8';

            if (route.name == 'Weather') {
              iconName = focused ?  'partly-sunny' : 'partly-sunny-outline'
            }
            else if (route.name == 'Settings') {
              iconName = focused ?  'settings' : 'settings-outline'
            }
            else if (route.name == 'About') {
              iconName = focused ?  'information-circle' : 'information-circle-outline'
            }

            return <Ionic name={iconName} size={size} color={colour} />
          },
          tabBarStyle: [
            {
              backgroundColor: '#46548a'
            }
          ],
        })}
      >
        <Tab.Screen 
          name='Weather'
          component={Weather}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name='About'
          component={About}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name='Settings'
          options={{ headerShown: false }}
          children={() => <Settings/>}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#84c4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
