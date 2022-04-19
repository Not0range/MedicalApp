import * as React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { CommonStyles } from '../Styles.g'

interface IProps {
  onPress?: () => void;
}

interface IState {
  
}

class VisitsWidget extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={CommonStyles.container}
        onPress={this.props.onPress}
      >
        <Text style={CommonStyles.headerText}>Посещения врачей</Text>
        <FlatList data={[
          {text: "Иванов И.И., эндокринолог", remaining: "3 д."},
          {text: "Яблочкин И.Д., дерматолог", remaining: "6 д."},
          {text: "Петров П.С., терапевт", remaining: "12 мая"},
          {text: "Медведев С.Ю., окулист", remaining: "23 мая"},
        ]}
        renderItem={({item}) => (
          <View style={CommonStyles.columns}>
            <Text style={CommonStyles.columnElement}>{item.text}</Text>
            <Text>{item.remaining}</Text>
          </View>
          )}/>
      </TouchableOpacity>
    )
  }
}

export default VisitsWidget;