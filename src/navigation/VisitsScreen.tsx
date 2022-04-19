import * as React from 'react';
import { TouchableOpacity, FlatList, View, Text } from 'react-native';

import IEmpty from '../common/empty';
import Visit from '../common/visit';

import { CommonStyles } from '../Styles.g'

interface IState {
  visits: Visit[]
}

class VisitsScreen extends React.Component<IEmpty, IState> {
  constructor(props: IEmpty){
    super(props);
    this.state = {
      visits: [
        {
          title: "Иванов И.И., эндокринолог", 
          date: "16 августа",
        },
        {
          title: "Яблочкин И.Д., дерматолог", 
          date: "19 августа",
        },
        {
          title: "Петров П.С., терапевт", 
          date: "12 мая",
        },
        {
          title: "Медведев С.Ю., окулист", 
          date: "23 мая",
        },
      ]
    }
  }
  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <View style={CommonStyles.columns}>
          <Text style={[CommonStyles.columnElement, CommonStyles.boldText]}>
            Врач
          </Text>
          <Text style={CommonStyles.boldText}>Дата посешения</Text>
        </View>
        <FlatList
        data={this.state.visits}
        renderItem={({item}) => (
          <TouchableOpacity style={[CommonStyles.columns, CommonStyles.container]}>
            <Text style={CommonStyles.columnElement}>{item.title}</Text>
            <Text>{item.date}</Text>
          </TouchableOpacity>
        )}/>
      </View>
    )
  }
}

export default VisitsScreen;