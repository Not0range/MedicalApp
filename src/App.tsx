import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import * as fs from 'react-native-fs'

import { store } from './modules/store'
import IEmpty from './common/empty'

import { 
  push as pushMedication, 
  setLastId as setMedicationLastId
} from './modules/slices/medicationsSlice';
import { 
  push as pushMeasuring, 
  setLastId as setMeasuringLastId
} from './modules/slices/measuringsSlice';
import { 
  push as pushContact, 
  setLastId as setContactLastId
} from './modules/slices/contactsSlice';
import { 
  push as pushVisit, 
  setLastId as setVisitLastId
} from './modules/slices/visitsSlice';

import HomeScreen from './navigation/HomeScreen';
import MedicationsScreen from './navigation/MedicationsScreen';
import MeasuringsScreen from './navigation/MeasuringsScreen';
import VisitsScreen from './navigation/VisitsScreen';
import ContactsScreen from './navigation/ContactsScreen';
import Medication from './common/medication';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MedicationModal from './navigation/modals/MedicationModal';
import MeasuringModal from './navigation/modals/MeasuringModal';
import Measuring from './common/measuring';
import ContactModal from './navigation/modals/ContactModal';
import Contact from './common/contact';
import Visit from './common/visit';
import VisitModal from './navigation/modals/VisitModal';

const settingsFilepath = `${fs.DocumentDirectoryPath}/settings.json`
const medicationsFilepath = `${fs.DocumentDirectoryPath}/medications.json`
const measuringsFilepath = `${fs.DocumentDirectoryPath}/measurings.json`
const contactsFilepath = `${fs.DocumentDirectoryPath}/contacts.json`
const visitsFilepath = `${fs.DocumentDirectoryPath}/visits.json`

interface INavigation {
  navigation: any;
}

interface ISettings {
  medicationLastId: number;
  measuringLastId: number;
  contactLastId: number;
  visitLastId: number;
}

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
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
  componentDidMount() {
    this.readSettings();
    this.readMedications();
    this.readMeasurings();
    this.readContacts();
    this.readVisits();
  }
  componentWillUnmount() {
    fs.writeFile(settingsFilepath, JSON.stringify({ 
      medicationLastId: store.getState().medications.lastId,
      measuringLastId: store.getState().measurings.lastId,
      contactLastId: store.getState().contacts.lastId,
      visitLastId: store.getState().visits.lastId
    }));
    fs.writeFile(medicationsFilepath, JSON.stringify(store.getState().medications.list));
    fs.writeFile(measuringsFilepath, JSON.stringify(store.getState().measurings.list));
    fs.writeFile(contactsFilepath, JSON.stringify(store.getState().contacts.list));
    fs.writeFile(visitsFilepath, JSON.stringify(store.getState().visits.list));
  }

  private Main({ navigation }: INavigation) : JSX.Element {
    return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} 
      options={{ title: "Сводные данные" }} initialParams={{ stack: navigation }}/>
      <Drawer.Screen name="Medications" component={MedicationsScreen} 
      options={{ title: "Приём лекарств" }} initialParams={{ stack: navigation }}/>
      <Drawer.Screen name="Measurings" component={MeasuringsScreen} 
      options={{ title: "Снятие измерений" }} initialParams={{ stack: navigation }}/>
      <Drawer.Screen name="Visits" component={VisitsScreen} 
      options={{ title: "Посещения врачей" }} initialParams={{ stack: navigation }}/>
      <Drawer.Screen name="Contacts" component={ContactsScreen} 
      options={{ title: "Контакты" }} initialParams={{ stack: navigation }}/>
    </Drawer.Navigator>);
  }
  private readSettings() {
    fs.exists(settingsFilepath).then(b => {
      if (b)
        fs.readFile(settingsFilepath).then(s => {
          const set = (JSON.parse(s) as ISettings);
          store.dispatch(setMedicationLastId(set.medicationLastId));
          store.dispatch(setMeasuringLastId(set.measuringLastId));
          store.dispatch(setContactLastId(set.contactLastId));
          store.dispatch(setVisitLastId(set.visitLastId));
        });
      else
        fs.writeFile(settingsFilepath, JSON.stringify({
           medicationLastId: 0,
           measuringLastId: 0,
           contactLastId: 0,
           visitLastId: 0
          }));
    })
  }
  private readMedications() {
    fs.exists(medicationsFilepath).then(b => {
      if (b)
        fs.readFile(medicationsFilepath)
          .then(s => (JSON.parse(s) as Medication[]).forEach(m => store.dispatch(pushMedication(m))));
      else
        fs.writeFile(medicationsFilepath, '[]');
    });
  }
  private readMeasurings() {
    fs.exists(measuringsFilepath).then(b => {
      if (b)
        fs.readFile(measuringsFilepath)
          .then(s => (JSON.parse(s) as Measuring[]).forEach(m => store.dispatch(pushMeasuring(m))));
      else
        fs.writeFile(measuringsFilepath, '[]');
    });
  }
  private readContacts() {
    fs.exists(contactsFilepath).then(b => {
      if (b)
        fs.readFile(contactsFilepath)
          .then(s => (JSON.parse(s) as Contact[]).forEach(c => store.dispatch(pushContact(c))));
      else
        fs.writeFile(contactsFilepath, '[]');
    });
  }
  private readVisits() {
    fs.exists(visitsFilepath).then(b => {
      if (b)
        fs.readFile(visitsFilepath)
          .then(s => (JSON.parse(s) as Visit[]).forEach(v => store.dispatch(pushVisit(v))));
      else
        fs.writeFile(visitsFilepath, '[]');
    });
  }
}

export default App;