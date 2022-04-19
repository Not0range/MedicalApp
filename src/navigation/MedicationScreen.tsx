import * as React from 'react';
import { TouchableOpacity, FlatList, View, Text } from 'react-native';

import IEmpty from '../common/empty';
import Medication from '../common/medication';

import { CommonStyles } from '../Styles.g'

interface IState {
  medications: Medication[]
}

class MedicationScreen extends React.Component<IEmpty, IState> {
  constructor(props: IEmpty){
    super(props);
    this.state = {
      medications: [
        {
          title: "Аквадетрим", 
          times: [
            {hours: 10, minutes: 0},
            {hours: 15, minutes: 0},
            {hours: 20, minutes: 0},
          ]
        },
        {
          title: "Глюконат натрия", 
          times: [
            {hours: 12, minutes: 0},
            {hours: 20, minutes: 0},
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
            Название лекарства
          </Text>
          <Text style={CommonStyles.boldText}>Время приёма</Text>
        </View>
        <FlatList
        data={this.state.medications}
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

export default MedicationScreen;