import moment from 'moment';
import * as React from 'react'
import { View, Text, TouchableOpacity, FlatList, Button, Alert, Modal, TextInput } from 'react-native'
import { connect, ConnectedProps } from 'react-redux';
import MinDate from '../../common/minDate';
import IScreen from '../../common/screen';
import Visit from '../../common/visit';
import { push, setCurrent, remove } from '../../modules/slices/visitsSlice';
import { AppDispatch, RootState } from '../../modules/store';
import { CommonStyles } from '../../Styles.g';
import * as fs from '../../fs'

interface IState {
  readonly: boolean;
  edit: boolean;
  type: number;
  value: number;
  min: number;
  max: number;
  doctorModalVisible: boolean;
  digitModalVisible: boolean;
}

type IProps = ReduxProps & IScreen

class VisitModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      readonly: this.props.current.id != -1,
      edit: this.props.current.id != -1,
      type: 0,
      value: 0,
      min: 1,
      max: 12,
      doctorModalVisible: false,
      digitModalVisible: false
    }
    this.props.navigation.setOptions({ 
      title: this.props.current.id != -1 ? 'Просмотр' : 'Добавление'
    });
  }
  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <Modal visible={this.state.digitModalVisible} transparent={true}>
          <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, 
            backgroundColor: 'gray', opacity: 0.5}} 
            onStartShouldSetResponder={ev => { 
              this.setState({ digitModalVisible: false });
              return true;
            }} />
          <View style={CommonStyles.overlayContainer}>
            <View style={{backgroundColor: 'white', borderColor: 'black', 
            borderWidth: 2, borderRadius: 10}}>
              <FlatList 
              data={Array.from({length: this.state.max - this.state.min + 1}, 
                (v, k) => k + this.state.min)}
              renderItem={({item}) => 
                <TouchableOpacity onPress={() => this.setInModal(item)}
                style={{backgroundColor: item == this.state.value ? 'lightblue' : 'white'}}>
                  <Text style={[CommonStyles.text, {padding: 10}]}>{item}</Text>
                </TouchableOpacity>}
              />
            </View>
          </View>
        </Modal>

        <Modal visible={this.state.doctorModalVisible} transparent={true}>
          <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, 
            backgroundColor: 'gray', opacity: 0.5}} 
            onStartShouldSetResponder={ev => { 
              this.setState({ doctorModalVisible: false });
              return true;
            }} />
          <View style={CommonStyles.overlayContainer}>
            <View style={{backgroundColor: 'white', borderColor: 'black', 
            borderWidth: 2, borderRadius: 10}}>
              <FlatList 
              data={this.props.doctors}
              renderItem={({item}) => 
                <TouchableOpacity 
                onPress={ev => {
                  this.props.setCurrent({...this.props.current, doctor: item});
                  this.setState({doctorModalVisible: false});
                }}
                style={{backgroundColor: item == this.props.current.doctor ? 'cyan' : 'white'}}>
                  <Text style={[CommonStyles.text, {padding: 10}]}>
                    {`${item.name}, ${item.position}`}
                  </Text>
                </TouchableOpacity>}
              />
            </View>
          </View>
        </Modal>
        
        <View style={{flex: 1}}>
          <Text style={CommonStyles.text}>Врач</Text>
          <TouchableOpacity
            style={{padding: 10, borderColor: 'black', borderWidth: 1, borderRadius: 5}}
            onPress={ev => {
              if (!this.state.readonly)
                this.setState({doctorModalVisible: true});
            }}>
            <Text style={CommonStyles.text}>
              {this.props.current.doctor ? 
              `${this.props.current.doctor.name}, ${this.props.current.doctor.position}` :
              'Не выбрано'}
            </Text>
          </TouchableOpacity>
          <Text style={CommonStyles.text}>Дата посещения</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
            style={{margin: 10}}
            onPress={ev => {
              if (this.state.readonly)
                return;
              this.setState({
                digitModalVisible: true,
                type: 0,
                min: 1, 
                max: moment().month(this.props.current.date.month - 1).daysInMonth(),
                value: this.props.current.date.day
              })
            }}>
              <Text style={CommonStyles.text}>
                {this.props.current.date.day.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
            <Text style={[CommonStyles.text, {textAlignVertical: 'bottom'}]}>.</Text>
            <TouchableOpacity
            style={{margin: 10}}
            onPress={ev => {
              if (this.state.readonly)
                return;
              this.setState({
                digitModalVisible: true, 
                type: 1,
                min: 1, 
                max: 12,
                value: this.props.current.date.month
              })
            }}>
              <Text style={CommonStyles.text}>
                {this.props.current.date.month.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
            <Text style={[CommonStyles.text, {textAlignVertical: 'bottom'}]}>.</Text>
            <TouchableOpacity 
            style={{margin: 10}}
            onPress={ev => {
              if (this.state.readonly)
                return;
              this.setState({
                digitModalVisible: true, 
                type: 2,
                min: moment().get('y') - 5, 
                max: moment().get('y') + 5,
                value: this.props.current.date.year
              })
            }}>
              <Text style={CommonStyles.text}>{this.props.current.date.year}</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: 5}}>
          <TextInput 
              value={`${this.props.current.date.time.hours}`}
              editable={!this.state.readonly}
              onChangeText={(text => {
                if (+text >= 24)
                  this.changeHours(23);
                else if (+text < 0)
                  this.changeHours(0);
                else
                  this.changeHours(+text);
              })}
              keyboardType="numeric"
              maxLength={2}
              style={[CommonStyles.text, CommonStyles.input, {flexGrow: 1, padding: 0}]}
            />
            <Text style={[CommonStyles.text, {fontWeight: 'bold', textAlignVertical: 'center', margin: 5}]}>
              :
            </Text>
            <TextInput 
              value={`${this.props.current.date.time.minutes}`}
              editable={!this.state.readonly}
              onChangeText={(text => {
                if (+text >= 60)
                  this.changeMinutes(59);
                else if (+text < 0)
                  this.changeMinutes(0);
                else
                  this.changeMinutes(+text);
              })}
              keyboardType="numeric"
              maxLength={2}
              style={[CommonStyles.text, CommonStyles.input, {flexGrow: 1, padding: 0}]}
            />
          </View>
        </View>
        {this.state.readonly ?
        <View style={{marginHorizontal: 5}}>
          <View style={{marginVertical: 5}}>
            <Button title='Редактировать' onPress={ev => {
              this.setState({ readonly: false });
              this.props.navigation.setOptions({ title: 'Редактирование' })
            }}/>
          </View>
          <View style={{marginVertical: 5}}>
            <Button title='Удалить' onPress={ev => {
              Alert.alert('Подтвержедние', 'Вы действительно желаете удалить выбранную запись?',
              [
                {
                  text: 'Да',
                  onPress: () => {
                    this.props.remove(this.props.current);
                    this.props.navigation.goBack();
                  }
                },
                {
                  text: "Нет",
                  style: 'cancel'
                }
              ])
            }}/>
          </View>
        </View> : 
        <Button title={this.state.edit ? 'Сохранить' : 'Добавить'} onPress={() => this.save()} />}
      </View>
    )
  }

  private changeHours(value: number) {
    const temp = { ...this.props.current.date.time }
    temp.hours = value;
    this.props.setCurrent({...this.props.current, date: {...this.props.current.date, time: temp}});
  }
  private changeMinutes(value: number) {
    const temp = { ...this.props.current.date.time }
    temp.minutes = value;
    this.props.setCurrent({...this.props.current, date: {...this.props.current.date, time: temp}});
  }
  private setInModal(value: number) {
    let date = {...this.props.current.date};
    let time = {...this.props.current.date.time};
    switch(this.state.type) {
      case 0:
        date.day = value;
        break;
      case 1:
        date.month = value;
        if (date.day > moment().month(value - 1).daysInMonth())
          date.day = moment().month(value - 1).daysInMonth();
        break;
      case 2:
        date.year = value;
        break;
      case 3:
        time.hours = value;
        break;
      case 4:
        time.minutes = value;
        break;
    }
    this.props.setCurrent({...this.props.current, date: {...date, time: {...time}}});
    this.setState({digitModalVisible: false});
  }
  private save() {
    if (this.props.current.doctor === undefined) {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      return;
    }
    this.props.push(this.props.current);
    fs.writeSettings();
    fs.writeVisits();
    this.props.navigation.goBack();
  }
}

const mapState = (state: RootState) => ({
  visits: state.visits.list,
  current: state.visits.current,
  lastId: state.visits.lastId,
  doctors: state.contacts.list
});

const mapDispatch = (dispatch: AppDispatch) => ({
  setCurrent: (v: Visit) => dispatch(setCurrent(v)),
  push: (v: Visit) => dispatch(push(v)),
  remove: (v: Visit) => dispatch(remove(v))
})

type ReduxProps = ConnectedProps<typeof connector>

const connector = connect(mapState, mapDispatch);

export default connector(VisitModal);