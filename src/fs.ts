import * as fs from 'react-native-fs'
import { store } from './modules/store'

import Medication from './common/medication';
import Measuring from './common/measuring';
import Contact from './common/contact';
import Visit from './common/visit';
import UserMedication from './common/userMedication';
import UserMeasuring from './common/userMeasuring';

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
  push as pushUserMed, 
  setLastId as setUserMedLastId
} from './modules/slices/userMedicationsSlice'
import {
  push as pushUserMeas, 
  setLastId as setUserMeasLastId
} from './modules/slices/userMeasuringsSlice'
import {
  push as pushDictionary
} from './modules/slices/dictionarySlice'
import { setState } from './modules/slices/loadingSlice';

import dictionary from './dictionary.json'

export const settingsFilepath = `${fs.DocumentDirectoryPath}/settings.json`
export const medicationsFilepath = `${fs.DocumentDirectoryPath}/medications.json`
export const measuringsFilepath = `${fs.DocumentDirectoryPath}/measurings.json`
export const contactsFilepath = `${fs.DocumentDirectoryPath}/contacts.json`
export const visitsFilepath = `${fs.DocumentDirectoryPath}/visits.json`
export const userMedFilepath = `${fs.DocumentDirectoryPath}/userMedications.json`
export const userMeasFilepath = `${fs.DocumentDirectoryPath}/userMeasurings.json`

interface ISettings {
  medicationLastId: number;
  measuringLastId: number;
  contactLastId: number;
  visitLastId: number;
  userMedLastId: number;
  userMeasLastId: number;
}

export async function readAll() {
  await readSettings();
  await readMedications();
  await readMeasurings();
  await readContacts();
  await readVisits();
  await readUserMed();
  await readUserMeas();
  readDictionary();
  store.dispatch(setState(false));
}
async function readSettings() {
  if (await fs.exists(settingsFilepath)) {
      const set = (JSON.parse(await fs.readFile(settingsFilepath)) as ISettings);
      store.dispatch(setMedicationLastId(set.medicationLastId));
      store.dispatch(setMeasuringLastId(set.measuringLastId));
      store.dispatch(setContactLastId(set.contactLastId));
      store.dispatch(setVisitLastId(set.visitLastId));
      store.dispatch(setUserMedLastId(set.userMedLastId));
      store.dispatch(setUserMeasLastId(set.userMeasLastId));
  }
  else
    await fs.writeFile(settingsFilepath, JSON.stringify({
      medicationLastId: 0,
      measuringLastId: 0,
      contactLastId: 0,
      visitLastId: 0,
      userMedLastId: 0,
      userMeasLastId: 0
    }));
}
async function readMedications() {
  if (await fs.exists(medicationsFilepath))
    (JSON.parse(await fs.readFile(medicationsFilepath)) as Medication[])
      .forEach(m => store.dispatch(pushMedication(m)));
  else
    await fs.writeFile(medicationsFilepath, '[]');
}
async function readMeasurings() {
  if (await fs.exists(measuringsFilepath))
    (JSON.parse(await fs.readFile(measuringsFilepath)) as Measuring[])
      .forEach(m => store.dispatch(pushMeasuring(m)));
  else
    await fs.writeFile(measuringsFilepath, '[]');
}
async function readContacts() {
  if (await fs.exists(contactsFilepath))
      (JSON.parse(await fs.readFile(contactsFilepath)) as Contact[])
        .forEach(c => store.dispatch(pushContact(c)));
  else
    fs.writeFile(contactsFilepath, '[]');
}
async function readVisits() {
  if (await fs.exists(visitsFilepath)) 
    (JSON.parse(await fs.readFile(visitsFilepath)) as Visit[]).forEach(v => store.dispatch(pushVisit(v)));
  else
    await fs.writeFile(visitsFilepath, '[]');
}
async function readUserMed() {
  if (await fs.exists(userMedFilepath)) 
    (JSON.parse(await fs.readFile(userMedFilepath)) as UserMedication[]).forEach(m => store.dispatch(pushUserMed(m)));
  else
    await fs.writeFile(userMedFilepath, '[]');
}
async function readUserMeas() {
  if (await fs.exists(userMeasFilepath)) 
    (JSON.parse(await fs.readFile(userMeasFilepath)) as UserMeasuring[]).forEach(m => store.dispatch(pushUserMeas(m)));
  else
    await fs.writeFile(userMeasFilepath, '[]');
}
function readDictionary() {
  for (let d of dictionary)
    store.dispatch(pushDictionary(d));
}

export async function writeAll() {
  await writeSettings();
  await writeMedications();
  await writeMeasurings();
  await writeContacts();
  await writeVisits();
  await writeUserMed();
  await writeUserMeas()
}
export async function writeSettings() {
  await fs.writeFile(settingsFilepath, JSON.stringify({ 
    medicationLastId: store.getState().medications.lastId,
    measuringLastId: store.getState().measurings.lastId,
    contactLastId: store.getState().contacts.lastId,
    visitLastId: store.getState().visits.lastId,
    userMedLastId: store.getState().userMedications.lastId,
    userMeasLastId: store.getState().userMeasurings.lastId
  }));
}
export async function writeMedications() {
  await fs.writeFile(medicationsFilepath, JSON.stringify(store.getState().medications.list));
}
export async function writeMeasurings() {
  await fs.writeFile(measuringsFilepath, JSON.stringify(store.getState().measurings.list));
}
export async function writeContacts() {
  await fs.writeFile(contactsFilepath, JSON.stringify(store.getState().contacts.list));
}
export async function writeVisits() {
  await fs.writeFile(visitsFilepath, JSON.stringify(store.getState().visits.list));
}
export async function writeUserMed() {
  await fs.writeFile(userMedFilepath, JSON.stringify(store.getState().userMedications.list));
}
export async function writeUserMeas() {
  await fs.writeFile(userMeasFilepath, JSON.stringify(store.getState().userMeasurings.list));
}