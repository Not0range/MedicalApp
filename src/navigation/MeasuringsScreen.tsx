import * as React from 'react';
import { TouchableOpacity, FlatList, View, Text, Button } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import IEmpty from '../common/empty';
import Measuring from '../common/measuring';
import IScreen from '../common/screen';
import { push, setCurrent } from '../modules/slices/measuringsSlice';
import { AppDispatch, RootState } from '../modules/store';

import { CommonStyles } from '../Styles.g'

type IProps = ReduxProps & IScreen;

class MeasuringsScreen extends React.Component<IProps, IEmpty> {
  constructor(props: IProps){
    super(props);
  }

  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <View style={CommonStyles.columns}>
          <Text style={[CommonStyles.columnElement, CommonStyles.boldText, CommonStyles.text]}>
            Вид измерения
          </Text>
          <Text style={[CommonStyles.boldText, CommonStyles.text]}>Время измерения</Text>
        </View>
        <FlatList
        data={this.props.measurings}
        renderItem={({index, item}) => (
          <TouchableOpacity style={[CommonStyles.columns, CommonStyles.container]}
          onPress={ev => {
            this.props.setCurrent(this.props.measurings[index]);
            this.props.navigation.navigate('MeasuringModal');
          }}>
            <Text style={[CommonStyles.columnElement, CommonStyles.text]}>{item.title}</Text>
            <View>
              {item.times.map(i => 
                <Text key={`${i.hours}${i.minutes}`} style={CommonStyles.text}>
                  {`${i.hours.toString().padStart(2, "0")}:${i.minutes.toString().padStart(2, "0")}`}
                </Text>)}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={ item => item.title }/>
        <Button title='Добавить' onPress={event => this.addMeas()}/>
      </View>
    )
  }

  private addMeas(): void {
    this.props.setCurrent({ id: -1, title: '', times: [] });
    this.props.navigation.navigate('MeasuringModal')
  }
}

const mapState = (state: RootState) => ({
  measurings: state.measurings.list,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  push: (m: Measuring) => dispatch(push(m)),
  setCurrent: (m: Measuring) => dispatch(setCurrent(m))
})

const connector = connect(mapState, mapDispatch);
type ReduxProps = ConnectedProps<typeof connector>

export default connector(MeasuringsScreen);