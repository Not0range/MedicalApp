import * as React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { CommonStyles } from '../Styles.g'

interface IProps {
  onPress?: () => void;
}

interface IState {
  
}

class MeasuringWidget extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={CommonStyles.container}
        onPress={this.props.onPress}
      >
        <Text style={CommonStyles.headerText}>Выполнение измерений</Text>
        <FlatList data={[
          {text: "Температура тела", remaining: "2 ч."},
          {text: "Артериальное давление", remaining: "6 ч."},
          {text: "Содержание сахара в крови", remaining: "12 ч."},
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

export default MeasuringWidget;