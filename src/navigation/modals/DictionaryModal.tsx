import * as React from 'react'
import { Text, View, FlatList } from 'react-native';
import IEmpty from '../../common/empty';
import { CommonStyles } from '../../Styles.g';

interface IProps {
    route: any;
    navigation: any;
}

export default class DictionaryModal extends React.Component<IProps, IEmpty> {
  constructor(props: IProps) {
    super(props);
    props.navigation.setOptions({title: props.route.params.title})
  }
  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <FlatList 
        ListHeaderComponent={() => 
        <Text style={[CommonStyles.headerText, { marginBottom: 10 }]}>
          {this.props.route.params.title}
        </Text>}
        data={this.props.route.params.text} 
        renderItem={({item}) => (
          <Text style={[CommonStyles.text, { marginBottom: 10 }]}>{item}</Text>
        )} />
      </View>
    )
  }
}