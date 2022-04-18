import * as React from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
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
          {text: "123"},
          {text: "321"},
        ]}
        renderItem={({item}) => <Text>{item.text}</Text>}/>
      </TouchableOpacity>
    )
  }
}

export default VisitsWidget;