import * as React from 'react'
import { CommonStyles } from '../../Styles.g'
import { connect, ConnectedProps } from 'react-redux';
import { RootState, AppDispatch } from '../../modules/store';
import { TouchableOpacity, FlatList, View, Text, Button } from 'react-native';

import { setCurrent } from '../../modules/slices/userMeasuringsSlice'
import IScreen from '../../common/screen';
import IEmpty from '../../common/empty';
import moment from 'moment';
import UserMeasuring from '../../common/userMeasuring';
import { ScrollView } from 'react-native-gesture-handler';

type IProps = ReduxProps & IScreen;

class UserMeasuringsTab extends React.Component<IProps, IEmpty> {
  constructor(props: IProps) {
    super(props);
  }
  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <View style={CommonStyles.columns}>
          <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '35%'}]}>
            Вид измерения
          </Text>
          <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '40%'}]}>
            Дата/время
          </Text>
          <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '25%'}]}>
            Значение
          </Text>
        </View>
        <FlatList 
        data={this.props.userMeasurings}
        renderItem={({item, index}) => (
          <TouchableOpacity style={CommonStyles.columns}
            onPress={ev => {
              this.props.setCurrent(this.props.userMeasurings[index]);
              this.props.navigation.navigate('UserMeasModal');
            }}>
            <Text
            style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '35%'}]}>
              {item.type}
            </Text>
            <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '40%'}]}>
            {`${item.date.day.toString().padStart(2, '0')}.` +
              `${item.date.month.toString().padStart(2, '0')}.${item.date.year} ` + 
              `${item.date.time.hours.toString().padStart(2, '0')}:${item.date.time.minutes.toString().padStart(2, '0')}`}
            </Text>
            <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '25%'}]}>
              {item.value.join('/')}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${item.id}`}
        />
        <Button title='Добавить' onPress={event => this.addMeas()}/>
      </View>
    );
  }

  private addMeas(): void {
    const t = moment();
    this.props.setCurrent({ id: -1, type: '', value: [0], date: {
      day: t.get('D'), month: t.get('M') + 1, year: t.get('y'), time: {
        hours: 0,
        minutes: 0
      }}});
    this.props.navigation.navigate('UserMeasModal')
  }
}

const mapState = (state: RootState) => ({
  userMeasurings: state.userMeasurings.list,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  setCurrent: (m: UserMeasuring) => dispatch(setCurrent(m))
})

const connector = connect(mapState, mapDispatch);
type ReduxProps = ConnectedProps<typeof connector>

export default connector(UserMeasuringsTab);