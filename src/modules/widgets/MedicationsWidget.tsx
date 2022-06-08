import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux'
import {  View, Text, TouchableOpacity } from 'react-native';
import Medication from '../../common/medication';
import { CommonStyles } from '../../Styles.g'

import { RootState } from '../store';
import moment from 'moment';
import { EventTime, getTodayTime } from '../../common/time';

interface IState {
  timer: NodeJS.Timeout | undefined
}

interface IProps extends ReduxProps {
  onPress?: () => void;
}

class MedicationsWidget extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      timer: undefined
    }
  }

  render() {
    const nearest = this.nearMedication(this.props.medications);
    return (
      <TouchableOpacity
        style={CommonStyles.container}
        onPress={this.props.onPress}
      >
        <Text style={CommonStyles.headerText}>Приём лекарств</Text>
        {nearest.length ? nearest.map(item => (
          <View key={item.title} style={CommonStyles.columns}>
            <Text style={CommonStyles.columnElement}>{item.title}</Text>
            <Text>Через {item.remainedStr}</Text>
          </View>
        )) : (
          <Text>В ближайшее время приём лекарств не требуется</Text>
        )}
      </TouchableOpacity>
    )
  }
  componentDidMount() {
    const update = () => {
      this.forceUpdate();
      this.setState({
        timer: setTimeout(update, 
          moment().seconds(0).add(1, 'minutes').diff(moment(), 'seconds'))
      });
    };
    this.setState({
      timer: setTimeout(update, 
        moment().seconds(0).add(1, 'minutes').diff(moment(), 'seconds'))
    });
  }
  componentWillUnmount() {
    if (this.state.timer)
      clearTimeout(this.state.timer);
  }

  private nearMedication(medications: Medication[]) : EventTime[] {
    const med: EventTime[] = [];
    let m: EventTime;
    let n = 0, t = 0, i = 0;
    for (let item of medications) {
      for (i = 0; i < item.times.length; i++)
        if (moment().diff(getTodayTime(item.times[i]), 'minutes') < 0)
          break;
      if (i == item.times.length)
        continue;
  
      n = Math.floor(moment().diff(getTodayTime(item.times[i]), 'minutes', true));
      for (; i< item.times.length; i++) {
        t = Math.floor(moment().diff(getTodayTime(item.times[i]), 'minutes', true));
        if (t < 0 && Math.abs(t) < Math.abs(n))
          n = t;
      }
      if (n >= 0)
        continue;
  
      m = { 
        title: item.title, 
        remained: -n,
        remainedStr: `${-n >= 60 ? `${Math.ceil(-n / 60)} ч. ` : ''}${-n % 60} мин.` 
      };
      med.push(m);
    }
    return med.sort((a, b) => a.remained - b.remained);
  }
}

const mapState = (state: RootState) => ({
  medications: state.medications.list
});

type ReduxProps = ConnectedProps<typeof connector>

const connector = connect(mapState);

export default connector(MedicationsWidget);