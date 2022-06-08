import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import * as fs from './fs'

import { store } from './modules/store'
import IEmpty from './common/empty'

import HomeScreen from './navigation/HomeScreen';
import MedicationsScreen from './navigation/MedicationsScreen';
import MeasuringsScreen from './navigation/MeasuringsScreen';
import VisitsScreen from './navigation/VisitsScreen';
import ContactsScreen from './navigation/ContactsScreen';

import MedicationModal from './navigation/modals/MedicationModal';
import MeasuringModal from './navigation/modals/MeasuringModal';
import ContactModal from './navigation/modals/ContactModal';
import VisitModal from './navigation/modals/VisitModal';
import DictionaryModal from './navigation/modals/DictionaryModal';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DictionaryScreen from './navigation/DictionaryScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
class App extends React.Component<IEmpty, IEmpty> {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Group screenOptions={{headerShown: false}}>
              <Stack.Screen name='Main' component={this.Main} />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen name='MedicationModal' component={MedicationModal} />
              <Stack.Screen name='MeasuringModal' component={MeasuringModal} />
              <Stack.Screen name='ContactModal' component={ContactModal} />
              <Stack.Screen name='VisitModal' component={VisitModal} />
              <Stack.Screen name='DictionaryModal' component={DictionaryModal} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
  componentDidMount() {
    fs.readAll();
  }
  componentWillUnmount() {
    fs.writeAll();
  }

  private Main() : JSX.Element {
    return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} 
      options={{ title: "Сводные данные" }} />
      <Drawer.Screen name="Medications" component={MedicationsScreen} 
      options={{ title: "Приём лекарств" }} />
      <Drawer.Screen name="Measurings" component={MeasuringsScreen} 
      options={{ title: "Снятие измерений" }} />
      <Drawer.Screen name="Visits" component={VisitsScreen} 
      options={{ title: "Посещения врачей" }} />
      <Drawer.Screen name="Contacts" component={ContactsScreen} 
      options={{ title: "Контакты" }} />
      <Drawer.Screen name='Dictionary' component={DictionaryScreen}
      options={{ title: "Справочник" }} />
    </Drawer.Navigator>);
  }
}

export default App;