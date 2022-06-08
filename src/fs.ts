import * as fs from 'react-native-fs'
import { store } from './modules/store'

import Medication from './common/medication';
import Measuring from './common/measuring';
import Contact from './common/contact';
import Visit from './common/visit';

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
import {
  push as pushDictionary
} from './modules/slices/dictionarySlice'

import dictionary from './dictionary.json'

const settingsFilepath = `${fs.DocumentDirectoryPath}/settings.json`
const medicationsFilepath = `${fs.DocumentDirectoryPath}/medications.json`
const measuringsFilepath = `${fs.DocumentDirectoryPath}/measurings.json`
const contactsFilepath = `${fs.DocumentDirectoryPath}/contacts.json`
const visitsFilepath = `${fs.DocumentDirectoryPath}/visits.json`

interface ISettings {
  medicationLastId: number;
  measuringLastId: number;
  contactLastId: number;
  visitLastId: number;
}

export function readAll() {
  readSettings();
  readMedications();
  readMeasurings();
  readContacts();
  readVisits();
  readDictionary();
}
function readSettings() {
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
  });
}
function readMedications() {
  fs.exists(medicationsFilepath).then(b => {
    if (b)
      fs.readFile(medicationsFilepath)
        .then(s => (JSON.parse(s) as Medication[]).forEach(m => store.dispatch(pushMedication(m))));
    else
      fs.writeFile(medicationsFilepath, '[]');
  });
}
function readMeasurings() {
  fs.exists(measuringsFilepath).then(b => {
    if (b)
      fs.readFile(measuringsFilepath)
        .then(s => (JSON.parse(s) as Measuring[]).forEach(m => store.dispatch(pushMeasuring(m))));
    else
      fs.writeFile(measuringsFilepath, '[]');
  });
}
function readContacts() {
  fs.exists(contactsFilepath).then(b => {
    if (b)
      fs.readFile(contactsFilepath)
        .then(s => (JSON.parse(s) as Contact[]).forEach(c => store.dispatch(pushContact(c))));
    else
      fs.writeFile(contactsFilepath, '[]');
  });
}
function readVisits() {
  fs.exists(visitsFilepath).then(b => {
    if (b)
      fs.readFile(visitsFilepath)
        .then(s => (JSON.parse(s) as Visit[]).forEach(v => store.dispatch(pushVisit(v))));
    else
      fs.writeFile(visitsFilepath, '[]');
  });
}
function readDictionary() {
  for (let d of dictionary)
    store.dispatch(pushDictionary(d));
}

export function writeAll() {
  writeSettings();
  writeMedications();
  writeMeasurings();
  writeContacts();
  writeVisits();
}
export function writeSettings() {
  fs.writeFile(settingsFilepath, JSON.stringify({ 
    medicationLastId: store.getState().medications.lastId,
    measuringLastId: store.getState().measurings.lastId,
    contactLastId: store.getState().contacts.lastId,
    visitLastId: store.getState().visits.lastId
  }));
}
export function writeMedications() {
  fs.writeFile(medicationsFilepath, JSON.stringify(store.getState().medications.list));
}
export function writeMeasurings() {
  fs.writeFile(measuringsFilepath, JSON.stringify(store.getState().measurings.list));
}
export function writeContacts() {
  fs.writeFile(contactsFilepath, JSON.stringify(store.getState().contacts.list));
}
export function writeVisits() {
  fs.writeFile(visitsFilepath, JSON.stringify(store.getState().visits.list));
}