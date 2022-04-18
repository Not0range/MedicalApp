import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './navigation/HomeScreen';
import MedicationScreen from './navigation/MedicationScreen';
import MeasuringScreen from './navigation/MeasuringScreen';
import VisitsScreen from './navigation/VisitsScreen';
import ContactsScreen from './navigation/ContactsScreen';

const Drawer = createDrawerNavigator();
class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Сводные данные" }}/>
          <Drawer.Screen name="Medication" component={MedicationScreen} options={{ title: "Приём лекарств" }}/>
          <Drawer.Screen name="Measuring" component={MeasuringScreen} options={{ title: "Снятие измерений" }}/>
          <Drawer.Screen name="Visits" component={VisitsScreen} options={{ title: "Посещения врачей" }}/>
          <Drawer.Screen name="Contacts" component={ContactsScreen} options={{ title: "Контакты" }}/>
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;