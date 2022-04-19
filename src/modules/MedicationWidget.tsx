import * as React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { CommonStyles } from '../Styles.g'

interface IProps {
  onPress?: () => void;
}

interface IState {
  
}

class MedicationWidget extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={CommonStyles.container}
        onPress={this.props.onPress}
      >
        <Text style={CommonStyles.headerText}>Приём лекарств</Text>
        <FlatList data={[
          {title: "Аквадетрим", remaining: "30 мин."},
          {title: "Глюконат натрия", remaining: "2 ч."},
        ]}
        renderItem={({item}) => (
        <View style={CommonStyles.columns}>
          <Text style={CommonStyles.columnElement}>{item.title}</Text>
          <Text>{item.remaining}</Text>
        </View>
        )}/>
      </TouchableOpacity>
    )
  }
}

export default MedicationWidget;