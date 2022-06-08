import * as React from 'react';
import { TouchableOpacity, FlatList, View, Text, Button, Touchable, TouchableWithoutFeedback } from 'react-native';

import Medication from '../common/medication';

import { push, setCurrent } from '../modules/slices/medicationsSlice';

import { CommonStyles } from '../Styles.g'
import { connect, ConnectedProps } from 'react-redux';
import { RootState, AppDispatch } from '../modules/store';
import IScreen from '../common/screen';
import IEmpty from '../common/empty';

type IProps = ReduxProps & IScreen;

class MedicationsScreen extends React.Component<IProps, IEmpty> {
  constructor(props: IProps){
    super(props);
  }
  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <View style={CommonStyles.columns}>
          <Text style={[CommonStyles.columnElement, CommonStyles.boldText, CommonStyles.text]}>
            Название лекарства
          </Text>
          <Text style={[CommonStyles.boldText, CommonStyles.text]}>Время приёма</Text>
        </View>
        <FlatList
        data={this.props.medications}
        renderItem={({index, item}) => (
          <TouchableOpacity style={[CommonStyles.columns, CommonStyles.container]}
          onPress={ev => {
            this.props.setCurrent(this.props.medications[index]);
            this.props.navigation.navigate('MedicationModal');
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
        keyExtractor={ item => item.title }
        />
        <Button title='Добавить' onPress={event => this.addMed()}/>
      </View>
    )
  }

  private addMed(): void {
    this.props.setCurrent({ id: -1, title: '', times: [] });
    this.props.navigation.navigate('MedicationModal')
  }
}

const mapState = (state: RootState) => ({
  medications: state.medications.list,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  setCurrent: (m: Medication) => dispatch(setCurrent(m))
})

const connector = connect(mapState, mapDispatch);
type ReduxProps = ConnectedProps<typeof connector>

export default connector(MedicationsScreen);