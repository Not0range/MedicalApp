import * as React from 'react';
import { TouchableOpacity, FlatList, View, Text } from 'react-native';

import IEmpty from '../common/empty';
import Measuring from '../common/measuring';

import { CommonStyles } from '../Styles.g'

interface IState {
  measurings: Measuring[]
}

class MeasuringScreen extends React.Component<IEmpty, IState> {
  constructor(props: IEmpty){
    super(props);
    this.state = {
      measurings: [
        {
          title: "Температура тела", 
          times: [
            {hours: 15, minutes: 0},
          ]
        },
        {
          title: "Артериальное давление", 
          times: [
            {hours: 14, minutes: 0},
            {hours: 18, minutes: 0},
          ]
        },
        {
          title: "Содержание сахара в крови", 
          times: [
            {hours: 9, minutes: 0},
            {hours: 21, minutes: 0},
          ]
        },
      ]
    };
  }

  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <View style={CommonStyles.columns}>
          <Text style={[CommonStyles.columnElement, CommonStyles.boldText]}>
            Вид измерения
          </Text>
          <Text style={CommonStyles.boldText}>Время измерения</Text>
        </View>
        <FlatList
        data={this.state.measurings}
        renderItem={({item}) => (
          <TouchableOpacity style={[CommonStyles.columns, CommonStyles.container]}>
            <Text style={CommonStyles.columnElement}>{item.title}</Text>
            <View>
              {item.times.map(i => 
                <Text>
                  {`${i.hours.toString().padStart(2, "0")}:${i.minutes.toString().padStart(2, "0")}`}
                </Text>)}
            </View>
          </TouchableOpacity>
        )}/>
      </View>
    )
  }
}

export default MeasuringScreen;