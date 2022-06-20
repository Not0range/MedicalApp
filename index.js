/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { store } from './src/modules/store'
import * as fs from './src/fs'
import { getTodayTime } from './src/common/time';
import notifee, { EventType } from '@notifee/react-native'

import { 
  push as pushUserMed
} from './src/modules/slices/userMedicationsSlice';
import { 
  push as pushUserMeas
} from './src/modules/slices/userMeasuringsSlice';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  if (type == EventType.ACTION_PRESS && pressAction.id) {
    fs.readAll();

    const id = `${notification.id}`;
    const nums = id.slice(3).split('.').map(t => +t);
    let cancel = true;
    switch (id.slice(0, 3)) {
      case 'med':
        AddUserMed(nums);
        break;
      case 'mea':
        cancel &&= AddUserMeas(nums, detail.input);
        break;
    }
    await fs.writeAll();
    if (cancel)
      await notifee.cancelDisplayedNotification(notification.id);
  }
})
function AddUserMed(nums) {
  const m = store.getState().medications.list.find(t => t.id == nums[0]);
  if (m) {
    const dt = getTodayTime(m.times[nums[1]]);
    const med = { 
      id: -1,
      title: m.title,
      date: {
        day: dt.get('date'),
        month: dt.get('month') + 1,
        year: dt.get('year'),
        time: { hours: dt.get('hour'), minutes: dt.get('minute') }
      }
    };
    store.dispatch(pushUserMed(med));
    return;
  }
}
function AddUserMeas(nums, input) {
  const v = `${input}`;
  if (!/^[\d\.,]+(\/[\d\.,]+)*$/.test(v.trim()))
    return false;
  const values = v.trim().replace(/,/, '.').split('/').map(t => +t);
  if (values.some(t => isNaN(t)))
    return false;
  
  const meas = store.getState().measurings.list.find(t => t.id == nums[0]);
  if (meas) {
    const dt = getTodayTime(meas.times[nums[1]]);
    const mea = { 
      id: -1,
      type: meas.title,
      date: {
        day: dt.get('date'),
        month: dt.get('month') + 1,
        year: dt.get('year'),
        time: { hours: dt.get('hour'), minutes: dt.get('minute') }
      },
      value: values
    };
    store.dispatch(pushUserMeas(mea));
    return true;
  }
  return false;
}

AppRegistry.registerComponent(appName, () => App);
