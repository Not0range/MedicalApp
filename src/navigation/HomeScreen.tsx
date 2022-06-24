import * as React from 'react';
import { ScrollView, Text, StyleSheet, AppState, NativeEventSubscription, ToastAndroid, Appearance } from 'react-native';
import IScreen from '../common/screen'
import notifee, { AuthorizationStatus, EventType } from '@notifee/react-native'

import MedicationsWidget from '../modules/widgets/MedicationsWidget';
import MeasuringWidget from '../modules/widgets/MeasuringWidget';
import VisitsWidget from '../modules/widgets/VisitsWidget';

import { CommonStyles } from '../Styles.g'
import moment from 'moment';
import { getTodayTime } from '../common/time';
import { store } from '../modules/store';
import { 
  setCurrent as setCurrentUserMed,
  push as pushUserMed
} from '../modules/slices/userMedicationsSlice';
import { 
  setCurrent as setCurrentUserMeas,
  push as pushUserMeas
} from '../modules/slices/userMeasuringsSlice';
import { 
  setCurrent as setCurrentVisit
} from '../modules/slices/visitsSlice';

interface IState {
  hours: number;
  unsubscribe: () => void;
  appStateSub: NativeEventSubscription | undefined
}

class HomeScreen extends React.Component<IScreen, IState> {
  constructor(props: IScreen) {
    super(props);
    this.state = {
      hours: moment().get('hours'),
      unsubscribe: () => {},
      appStateSub: undefined
    };
  }

  render() {
    const { hours } = this.state;
    let greetings;
    if (hours >= 6 && hours < 12)
      greetings = "Доброе утро!";
    else if (hours >= 12 && hours < 18)
      greetings = "Добрый день!";
    else if (hours >= 18 && hours < 22)
      greetings = "Добрый вечер!";
    else
      greetings = "Доброй ночи!";

    return (
      <ScrollView style={CommonStyles.screenContainer}>
        <Text style={styles.greetings}>{greetings}</Text>
        <MedicationsWidget onPress={() => this.navigate("Medications")} />
        <MeasuringWidget onPress={() => this.navigate('Measurings')} />
        <VisitsWidget onPress={() => this.navigate('Visits')} />
      </ScrollView>
    )
  }
  componentDidMount() {
    this.checkPermission();
    this.setState({appStateSub:  AppState.addEventListener('change', state => {
      if (state === 'active')
        this.StartNotification();
    })});
  }
  componentWillUnmount() {
    this.state.unsubscribe();
    this.state.appStateSub?.remove();
  }

  private navigate(screen: string) {
    this.props.navigation.navigate(screen);
  }

  private async checkPermission() {
    let notif = await notifee.getNotificationSettings();
    if (notif.authorizationStatus != AuthorizationStatus.AUTHORIZED)
      notif = await notifee.requestPermission();

    if(notif.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
      this.setState({ unsubscribe: notifee.onForegroundEvent(({type, detail}) => {
        if (type == EventType.PRESS) {
          const id = `${detail.notification?.id}`;
          const nums = id.slice(3).split('.').map(t => +t);

          switch (id.slice(0, 3)) {
            case 'med':
              this.UserMed(nums, false);
              break;
            case 'mea':
              this.UserMea(nums, detail.input, false);
              break;
            case 'vis':
              this.Visit(nums);
              break;
          }
          if (detail.notification?.id)
            notifee.cancelDisplayedNotification(detail.notification?.id);
        }
        else if(type == EventType.ACTION_PRESS && detail.pressAction?.id) {
          const id = `${detail.notification?.id}`;
          const nums = id.slice(3).split('.').map(t => +t);
          
          let cancel = true;
          switch (id.slice(0, 3)) {
            case 'med':
              this.UserMed(nums, true);
              break;
            case 'mea':
              cancel &&= this.UserMea(nums, detail.input, true);
              break;
          }
          
          if (cancel && detail.notification?.id)
            notifee.cancelDisplayedNotification(detail.notification?.id);
        }
      })});
    }
  }
  private UserMed(nums: number[], push: boolean) : void {
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
      if (push) {
        store.dispatch(pushUserMed(med));
        return;
      }
      store.dispatch(setCurrentUserMed(med));
      this.props.navigation.navigate('UserMedModal');
    }
  }
  private UserMea(nums: number[], input: string | undefined, push: boolean) : boolean {
    let values : number[];
    if (push) {
    const v = `${input}`;
      if (!/^[\d\.,]+(\/[\d\.,]+)*$/.test(v.trim()))
        return false;
      values = v.trim().replace(/,/, '.').split('/').map(t => +t);
      if (values.some(t => isNaN(t)))
        return false;
    }
    else values = [0];
    
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
      if (push) {
        store.dispatch(pushUserMeas(mea));
        return true;
      }
      store.dispatch(setCurrentUserMeas(mea));
      this.props.navigation.navigate('UserMeasModal');
      return true;
    }
    return false;
  }
  private Visit(nums: number[]) {
    const v = store.getState().visits.list.find(t => t.id == nums[0]);
    if (v) {
      store.dispatch(setCurrentVisit(v));
      this.props.navigation.navigate('VisitModal');
    }
  }
  private async StartNotification() {
    const n = await notifee.getInitialNotification();
    if (n) {
      while (store.getState().loading.loading);

      const id = `${n.notification.id}`;
      const nums = id.slice(3).split('.').map(t => +t);
      switch (id.slice(0, 3)) {
        case 'med':
          this.UserMed(nums, false);
          break;
        case 'mea':
          this.UserMea(nums, n.input, false);
          break;
        case 'vis':
          this.Visit(nums);
          break;
      }
    }
  }
}

const styles = StyleSheet.create({
  greetings: {
    fontWeight: 'bold',
    fontSize: 30,
  }
});

export default HomeScreen;