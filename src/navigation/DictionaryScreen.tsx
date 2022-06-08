import * as React from "react";
import { Text, View } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { connect, ConnectedProps } from "react-redux";
import IEmpty from "../common/empty";
import IScreen from "../common/screen";
import { RootState } from "../modules/store";
import { CommonStyles } from "../Styles.g";

type IProps = ReduxProps & IScreen

class DictionaryScreen extends React.Component<IProps, IEmpty> {
  constructor(props: IProps) {
    super(props);
  }
  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <FlatList 
        data={this.props.dictionary} 
        renderItem={({item}) => (
          <TouchableOpacity 
          style={CommonStyles.container} 
          onPress={() => this.props.navigation.navigate('DictionaryModal', {title: item.title, text: item.text})}>
            <Text style={CommonStyles.headerText}>{item.title}</Text>
          </TouchableOpacity>
        )} 
        />
      </View>
    );
  }
}

const mapState = (state: RootState) => ({
  dictionary: state.dictionary.list,
});

const connector = connect(mapState);
type ReduxProps = ConnectedProps<typeof connector>

export default connector(DictionaryScreen);