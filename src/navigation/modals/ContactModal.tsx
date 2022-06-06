import * as React from 'react'
import { View, Text, TextInput, FlatList, Button, Alert } from 'react-native'
import { connect, ConnectedProps } from 'react-redux';
import Contact from '../../common/contact';
import IScreen from '../../common/screen';
import { push, setCurrent, remove } from '../../modules/slices/contactsSlice';
import { AppDispatch, RootState } from '../../modules/store';
import { CommonStyles } from '../../Styles.g';

interface IState {
  readonly: boolean,
  edit: boolean
}

type IProps = ReduxProps & IScreen

class ContactModal extends React.Component<IProps, IState> {
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
        <View style={{flex: 1}}>
          <Text style={CommonStyles.text}>ФИО</Text>
          <TextInput 
            style={[CommonStyles.text, CommonStyles.input]}
            value={this.props.current.name}
            editable={!this.state.readonly}
            onChangeText={(text) => this.props.setCurrent({
              ...this.props.current,
              name: text
            })}
          />
          <Text style={CommonStyles.text}>Специальность</Text>
          <TextInput 
            style={[CommonStyles.text, CommonStyles.input]}
            value={this.props.current.position}
            editable={!this.state.readonly}
            onChangeText={(text) => this.props.setCurrent({
              ...this.props.current,
              position: text
            })}
          />
          <Text style={CommonStyles.text}>Номер телефона</Text>
          <TextInput 
            style={[CommonStyles.text, CommonStyles.input]}
            value={this.props.current.tel}
            editable={!this.state.readonly}
            onChangeText={(text) => this.props.setCurrent({
              ...this.props.current,
              tel: text
            })}
          />
          <Text style={CommonStyles.text}>Рабочий телефон</Text>
          <TextInput 
            style={[CommonStyles.text, CommonStyles.input]}
            value={this.props.current.workTel}
            editable={!this.state.readonly}
            onChangeText={(text) => this.props.setCurrent({
              ...this.props.current,
              workTel: text
            })}
          />
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

  private save() {
    if (this.props.current.name.trim() == '' || 
    this.props.current.position.trim() == '') {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      return;
    }
    this.props.push({
        id: this.props.current.id,
        name: this.props.current.name.trim(),
        position: this.props.current.position.trim(),
        tel: this.props.current.tel.trim(),
        workTel: this.props.current.workTel.trim()
    });
    this.props.navigation.goBack();
  }
}

const mapState = (state: RootState) => ({
  contacts: state.contacts.list,
  current: state.contacts.current,
  lastId: state.contacts.lastId
});

const mapDispatch = (dispatch: AppDispatch) => ({
  setCurrent: (c: Contact) => dispatch(setCurrent(c)),
  push: (c: Contact) => dispatch(push(c)),
  remove: (c: Contact) => dispatch(remove(c))
})

type ReduxProps = ConnectedProps<typeof connector>

const connector = connect(mapState, mapDispatch);

export default connector(ContactModal);