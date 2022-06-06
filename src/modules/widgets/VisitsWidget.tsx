import moment from 'moment';
import * as React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import Visit from '../../common/visit';
import { CommonStyles } from '../../Styles.g'
import { RootState } from '../store';

interface IState {
  timer: NodeJS.Timeout | undefined
}

interface IProps extends ReduxProps {
  onPress?: () => void;
}

class VisitsWidget extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      timer: undefined
    }
  }

  render() {
    const nearest = this.nearVisit(this.props.visits);
    return (
      <TouchableOpacity
        style={CommonStyles.container}
        onPress={this.props.onPress}
      >
        <Text style={CommonStyles.headerText}>Посещение врачей</Text>
        {nearest.length ? nearest.map(item => (
          <View key={item[0]} style={CommonStyles.columns}>
            <Text style={CommonStyles.columnElement}>{item[0]}</Text>
            <Text>{item[1]}</Text>
          </View>
        )) : (
          <Text>В ближайшее время посещения врачей не требуется</Text>
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

  private nearVisit(visits: Visit[]) : string[][] {
    const vis: string[][] = [];
    let m: moment.Moment;
    for (let v of visits) {
      m = moment().date(v.date.day).month(v.date.month - 1).year(v.date.year)
        .hours(v.date.time.hours).minutes(v.date.time.minutes).seconds(0).milliseconds(0);
      if (m < moment())
        continue;
      if (m.get('D') == moment().get('D') && m.get('M') == moment().get('M'))
        vis.push([`${v.doctor?.name}, ${v.doctor?.position}`, `Сегодня в ${v.date.time.hours.toString().padStart(2, '0')}:${v.date.time.minutes.toString().padStart(2, '0')}`]);
      else if (m.get('D') - moment().get('D') == 1 && m.get('M') == moment().get('M'))
        vis.push([`${v.doctor?.name}, ${v.doctor?.position}`, `Завтра в ${v.date.time.hours.toString().padStart(2, '0')}:${v.date.time.minutes.toString().padStart(2, '0')}`]);
      else if(m.get('y') != moment().get('y'))
        vis.push([`${v.doctor?.name}, ${v.doctor?.position}`, `${v.date.day.toString().padStart(2, '0')}.${v.date.month.toString().padStart(2, '0')}.${v.date.year.toString().padStart(2, '0')}`]);
      else 
        vis.push([`${v.doctor?.name}, ${v.doctor?.position}`, `${v.date.day.toString().padStart(2, '0')}.${v.date.month.toString().padStart(2, '0')}`]);
    }
    return vis;
  }
}

const mapState = (state: RootState) => ({
  visits: state.visits.list
});

type ReduxProps = ConnectedProps<typeof connector>

const connector = connect(mapState);

export default connector(VisitsWidget);