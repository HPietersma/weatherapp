//import { StatusBar } from 'expo-status-bar';
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
    // <View style={styles.container}>
    //   <Weather/>
    // </View>

    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({focused, size, colour}) => {
            let iconName;

            if (route.name == 'Weather') {
              iconName = focused ? 'partly-sunny-outline' : 'partly-sunny'
            }
            else if (route.name == 'Settings') {
              iconName = focused ? 'settings-outline' : 'settings'
            }
            else if (route.name == 'About') {
              iconName = focused ? 'information-circle-outline' : 'information-circle'
            }


            return <Ionic name={iconName} size={size} colour={colour} />
          }
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
          component={Settings}
          options={{ headerShown: false }}
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
