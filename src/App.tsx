import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Provider } from 'react-redux';
import * as fs from './fs'

import { store } from './modules/store'
import IEmpty from './common/empty'

import HomeScreen from './navigation/HomeScreen';
import MedicationsScreen from './navigation/MedicationsScreen';
import MeasuringsScreen from './navigation/MeasuringsScreen';
import VisitsScreen from './navigation/VisitsScreen';
import ContactsScreen from './navigation/ContactsScreen';
import DictionaryScreen from './navigation/DictionaryScreen';

import UserMedicationsTab from './navigation/tabs/UserMedicationsTab';
import UserMeasuringsTab from './navigation/tabs/UserMeasuringsTab';

import MedicationModal from './navigation/modals/MedicationModal';
import MeasuringModal from './navigation/modals/MeasuringModal';
import ContactModal from './navigation/modals/ContactModal';
import VisitModal from './navigation/modals/VisitModal';
import DictionaryModal from './navigation/modals/DictionaryModal';
import UserMedicationModal from './navigation/modals/UserMedicationModal';
import UserMeasuringModal from './navigation/modals/UserMeasuringModal';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';

interface IState {
  
}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const MedTab = createBottomTabNavigator();
const MeasTab = createBottomTabNavigator();

class App extends React.Component<IEmpty, IState> {
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
              <Stack.Screen name='UserMedModal' component={UserMedicationModal} />
              <Stack.Screen name='UserMeasModal' component={UserMeasuringModal} />
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
      <Drawer.Screen name="Medications" component={Medications} 
      options={{ title: "Приём лекарств" }} />
      <Drawer.Screen name="Measurings" component={Measurings} 
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
function Medications() : JSX.Element {
  return (
    <MedTab.Navigator backBehavior='none'
    screenOptions={{ lazy: false, tabBarLabelStyle: { fontSize: 16 }, 
    headerShown: false }}>
      <MedTab.Screen name='MedicationsTab' component={MedicationsScreen}
      options={{ title: "Расписание", tabBarIcon: ({color, size}) => (
        <IconFA name="pencil-square-o" color={color} size={size} />
      )}} />
      <MedTab.Screen name='UserMedicationsTab' component={UserMedicationsTab}
      options={{ title: "Приём", tabBarIcon: ({color, size}) => (
        <IconFA5 name="tablets" color={color} size={size} />
      )}} />
    </MedTab.Navigator>
  )
}
function Measurings() : JSX.Element {
  return (
    <MeasTab.Navigator backBehavior='none'
    screenOptions={{ lazy: false, tabBarLabelStyle: { fontSize: 16 }, headerShown: false }}>
      <MeasTab.Screen name='MeasuringsTab' component={MeasuringsScreen}
      options={{ title: "Расписание", tabBarIcon: ({color, size}) => (
        <IconFA name="pencil-square-o" color={color} size={size} />
      )}} />
      <MeasTab.Screen name='UserMeasuringsTab' component={UserMeasuringsTab}
      options={{ title: "Измерения", tabBarIcon: ({color, size}) => (
        <IconFA5 name="thermometer" color={color} size={size} />
      )}} />
    </MeasTab.Navigator>
  )
}

export default App;