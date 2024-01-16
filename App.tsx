import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import WebviewScreen from './src/screens/WebviewScreen';

const Stack = createStackNavigator();

const ValidicStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="WebviewScreen" component={WebviewScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return <NavigationContainer>{ValidicStack()}</NavigationContainer>;
};

export default App;
