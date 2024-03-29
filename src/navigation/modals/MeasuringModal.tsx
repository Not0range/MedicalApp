import * as React from 'react'
import { View, Text, TextInput, FlatList, Button, Alert } from 'react-native'
import { connect, ConnectedProps } from 'react-redux';
import Measuring from '../../common/measuring';
import IScreen from '../../common/screen';
import { push, setCurrent, remove } from '../../modules/slices/measuringsSlice';
import { AppDispatch, RootState } from '../../modules/store';
import { CommonStyles } from '../../Styles.g';
import * as fs from '../../fs'
import notifee, { RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native'
import { getTodayTime } from '../../common/time';
import moment from 'moment';

interface IState {
  readonly: boolean,
  edit: boolean
}

type IProps = ReduxProps & IScreen

class MeasuringModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      readonly: this.props.current.id != -1,
      edit: this.props.current.id != -1
    }
    this.props.navigation.setOptions({ 
      title: this.props.current.id != -1 ? 'Просмотр' : 'Добавление'
    });
  }
  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <Text style={CommonStyles.text}>Название измерения</Text>
        <TextInput 
          style={[CommonStyles.text, CommonStyles.input]}
          value={this.props.current.title}
          editable={!this.state.readonly}
          onChangeText={(text) => this.props.setCurrent({
            ...this.props.current,
            title: text
          })}
        />
        <View style={{flexDirection: 'row', marginHorizontal: 5}}>
          <Text style={[CommonStyles.text, {flexGrow: 1}]}>Время измерения</Text>
          {!this.state.readonly ? 
          <Button title='+' onPress={ev => {
            if (!this.props.current.times.some(t => t.hours == 0 && t.minutes == 0))
              this.pushTime();
            }}
          /> : null}
        </View>
        <FlatList
          data={this.props.current.times}
          renderItem={({index, item}) => (
            <View style={{flexDirection: 'row', marginHorizontal: 5}}>
              <TextInput 
                value={`${item.hours}`}
                editable={!this.state.readonly}
                onChangeText={(text => {
                  if (+text >= 24)
                    this.changeHours(index, 23);
                  else if (+text < 0)
                    this.changeHours(index, 0);
                  else
                    this.changeHours(index, +text);
                })}
                keyboardType="numeric"
                maxLength={2}
                style={[CommonStyles.text, CommonStyles.input, {flexGrow: 1, padding: 0}]}
              />
              <Text
              style={[CommonStyles.text, {fontWeight: 'bold', textAlignVertical: 'center', margin: 5}]}>
                :
              </Text>
              <TextInput 
                value={`${item.minutes}`}
                editable={!this.state.readonly}
                onChangeText={(text => {
                  if (+text >= 60)
                    this.changeMinutes(index, 59);
                  else if (+text < 0)
                    this.changeMinutes(index, 0);
                  else
                    this.changeMinutes(index, +text);
                })}
                keyboardType="numeric"
                maxLength={2}
                style={[CommonStyles.text, CommonStyles.input, {flexGrow: 1, padding: 0}]}
              />
              {!this.state.readonly ? 
              <Button title='X' onPress={ev => this.removeTime(index)} /> :
              null}
            </View>
          )}
        />
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
                    notifee.getTriggerNotificationIds().then(ids => {
                      const id = ids.filter(t => t.startsWith(`mea${this.props.current.id}`));
                      if (id.length > 0)
                        notifee.cancelTriggerNotifications();
                    });
                    this.props.remove(this.props.current);
                    fs.writeMeasurings();
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

  private changeHours(index: number, value: number) {
    const temp = { ...this.props.current }
    temp.times[index].hours = value;
    this.props.setCurrent(temp);
  }
  private changeMinutes(index: number, value: number) {
    const temp = { ...this.props.current }
    temp.times[index].minutes = value;
    this.props.setCurrent(temp);
  }
  private pushTime() {
    const temp = [...this.props.current.times];
    temp.push({ hours: 0, minutes: 0 })
    this.props.setCurrent({ ...this.props.current, times: temp });
  }
  private removeTime(index: number) {
    const temp = [...this.props.current.times];
    temp.splice(index, 1);
    this.props.setCurrent({ ...this.props.current, times: temp });
  }
  private save() {
    if (this.props.current.title.trim() == '' || this.props.current.times.length == 0) {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      return;
    }
    if (this.props.measurings.some(t => t.title.toLowerCase() == 
      this.props.current.title.trim().toLowerCase() && t.id != this.props.current.id)) {
      Alert.alert('Ошибка', 'Запись с таким именем уже существует');
      return;
    }
    this.props.push({ ...this.props.current, title: this.props.current.title.trim() });
    this.setNotifications();

    fs.writeSettings();
    fs.writeMeasurings();
    this.props.navigation.goBack();
  }
  private async setNotifications() {
    let cur_id = this.props.current.id;
    if (cur_id != -1) {
      const ids = (await notifee.getTriggerNotificationIds())
      .filter(t => t.startsWith(`mea${cur_id}`));
      if (ids.length > 0)
        notifee.cancelTriggerNotifications(ids);
    }
    else
      cur_id = this.props.lastId;

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default'
    });
    let i = 0;
    for (let t of this.props.current.times) {
      let ts = getTodayTime(t);
      if (ts < moment())
        ts.add(1, 'day');
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: ts.toDate().getTime(), 
        repeatFrequency: RepeatFrequency.DAILY
      };
      await notifee.createTriggerNotification(
        {
          id: `mea${cur_id}.${i++}`,
          title: 'Выполнение измерений',
          body: `Необходимо выполнить измерение: ${this.props.current.title}`,
          android: {
            channelId: channelId,
            actions: [
              {
                title: 'Отметить',
                pressAction: {
                  id: 'mark-as-read'
                },
                input: {
                  placeholder: "36,6 или 120/80",
                },
              }
            ],
            pressAction: {
              id: 'default'
            },
            autoCancel: false,
            smallIcon: 'notification_icon'
          },
          ios: {
            //todo
          }
        },
        trigger,
      );
    }
  }
}

const mapState = (state: RootState) => ({
  measurings: state.measurings.list,
  current: state.measurings.current,
  lastId: state.measurings.lastId
});

const mapDispatch = (dispatch: AppDispatch) => ({
  setCurrent: (m: Measuring) => dispatch(setCurrent(m)),
  push: (m: Measuring) => dispatch(push(m)),
  remove: (m: Measuring) => dispatch(remove(m))
})

type ReduxProps = ConnectedProps<typeof connector>

const connector = connect(mapState, mapDispatch);

export default connector(MeasuringModal);