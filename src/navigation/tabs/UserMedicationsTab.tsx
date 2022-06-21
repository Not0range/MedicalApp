import * as React from 'react'
import UserMedication from '../../common/userMedication';
import { CommonStyles } from '../../Styles.g'
import { connect, ConnectedProps } from 'react-redux';
import { RootState, AppDispatch } from '../../modules/store';
import { TouchableOpacity, FlatList, View, Text, Button } from 'react-native';

import { setCurrent } from '../../modules/slices/userMedicationsSlice'
import IScreen from '../../common/screen';
import IEmpty from '../../common/empty';
import moment from 'moment';

type IProps = ReduxProps & IScreen;

class UserMedicationsTab extends React.Component<IProps, IEmpty> {
  constructor(props: IProps) {
    super(props);
  }
  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <View style={CommonStyles.columns}>
          <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '60%'}]}>
            Лекарство
          </Text>
          <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '40%'}]}>
            Дата/время
          </Text>
        </View>
        <FlatList 
        data={this.props.userMedications}
        renderItem={({item, index}) => (
          <TouchableOpacity style={CommonStyles.columns}
            onPress={ev => {
              this.props.setCurrent(this.props.userMedications[index]);
              this.props.navigation.navigate('UserMedModal');
            }}>
            <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '60%'}]}>
              {item.title}
            </Text>
            <Text style={[CommonStyles.boldText, CommonStyles.text, CommonStyles.table, {width: '40%'}]}>
              {`${item.date.day.toString().padStart(2, '0')}.` +
              `${item.date.month.toString().padStart(2, '0')}.${item.date.year} ` + 
              `${item.date.time.hours.toString().padStart(2, '0')}:${item.date.time.minutes.toString().padStart(2, '0')}`}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${item.id}`}
        />
        <Button title='Добавить' onPress={event => this.addMed()}/>
      </View>
    );
  }

  private addMed(): void {
    const t = moment();
    this.props.setCurrent({ id: -1, title: '', date: {
      day: t.get('D'), month: t.get('M') + 1, year: t.get('y'), time: {
        hours: 0,
        minutes: 0
      }}});
    this.props.navigation.navigate('UserMedModal')
  }
}

const mapState = (state: RootState) => ({
  userMedications: state.userMedications.list,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  setCurrent: (m: UserMedication) => dispatch(setCurrent(m))
})

const connector = connect(mapState, mapDispatch);
type ReduxProps = ConnectedProps<typeof connector>

export default connector(UserMedicationsTab);