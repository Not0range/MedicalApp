import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './HomeScreen';
import NotHomeScreen from './NotHomeScreen';

const Drawer = createDrawerNavigator();
class App extends React.Component {
  render() {
    return (
      <View>
        <Text>Hello!</Text>
      </View>
    );
  }
}

export default App;