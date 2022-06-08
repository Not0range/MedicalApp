import * as React from 'react';
import { TouchableOpacity, FlatList, View, Text, Button, Modal, BackHandler, NativeEventSubscription, Linking } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { connect, ConnectedProps } from 'react-redux';
import Contact from '../common/contact';

import IScreen from '../common/screen';
import { push, setCurrent } from '../modules/slices/contactsSlice';
import { AppDispatch, RootState } from '../modules/store';

import { CommonStyles } from '../Styles.g'

interface IState {
  modalVisible: boolean;
  current: number;
  subscription: NativeEventSubscription | undefined
}

type IProps = ReduxProps & IScreen;

class ContactsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps){
    super(props);
    this.state = {
      modalVisible: false,
      current: -1,
      subscription: undefined
    }
  }

  render() {
    return (
      <View style={CommonStyles.screenContainer}>
        <Modal visible={this.state.modalVisible} transparent={true}
        onRequestClose={() => this.state.subscription?.remove()}>
          <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, 
            backgroundColor: 'gray', opacity: 0.5}} 
            onStartShouldSetResponder={ev => { 
              this.setState({ modalVisible: false });
              return true;
            }} />
          <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', marginHorizontal: 50}}>
            <View style={{backgroundColor: 'white', borderColor: 'black', borderWidth: 2, borderRadius: 10}}>
              <TouchableOpacity style={{margin: 15}} onPress={ev => {
                this.props.setCurrent(this.props.contacts[this.state.current]);
                this.props.navigation.navigate('ContactModal');
                this.setState({ modalVisible: false });
              }}>
                <Text style={CommonStyles.text}>Открыть</Text>
              </TouchableOpacity>
              {this.state.current != -1 && this.props.contacts[this.state.current].tel != '' ?
              <TouchableOpacity style={{margin: 15}} 
              onPress={ev => {
                Linking.openURL(`tel:${this.props.contacts[this.state.current].tel}`);
                this.setState({ modalVisible: false });
              }}>
                <Text style={CommonStyles.text}>Позвонить на личный номер</Text>
              </TouchableOpacity> : null}
              {this.state.current != -1 && this.props.contacts[this.state.current].workTel != '' ?
              <TouchableOpacity style={{margin: 15}}
              onPress={ev => {
                Linking.openURL(`tel:${this.props.contacts[this.state.current].workTel}`);
                this.setState({ modalVisible: false });
              }}>
                <Text style={CommonStyles.text}>Позвонить на рабочий номер</Text>
              </TouchableOpacity> : null}
            </View>
          </View>
        </Modal>

        <FlatList
        data={this.props.contacts}
        renderItem={({index, item}) => (
          <TouchableOpacity style={[CommonStyles.container]}
          onPress={ev => this.contactTouch(index)}>
              <Text style={CommonStyles.text}>{item.name}</Text>
              <Text style={CommonStyles.text}>Специальность: {item.position}</Text>
              {item.tel != '' ?<Text style={CommonStyles.text}>Телефон: {item.tel}</Text> : null}
              {item.workTel != '' ?<Text style={CommonStyles.text}>Раб. телефон: {item.workTel}</Text> : null}
          </TouchableOpacity>
        )}
        keyExtractor={ item => item.tel }/>
        <Button title='Добавить' onPress={event => this.addCont()}/>
      </View>
    )
  }

  private addCont(): void {
    this.props.setCurrent({ id: -1, name: '', position: '', tel: '', workTel: '' });
    this.props.navigation.navigate('ContactModal')
  }
  private backHandler(): boolean {
    if (this.state.modalVisible) {
      this.setState({ modalVisible: false });
      return true;
    }
    return false;
  }
  private contactTouch(index: number) {
    if (this.props.contacts[index].tel != '' || 
    this.props.contacts[index].workTel != '' )
      this.setState({ 
        modalVisible: true, 
        current: index,
        subscription: BackHandler.addEventListener('hardwareBackPress', () => this.backHandler())
      })
    else {
      this.props.setCurrent(this.props.contacts[index]);
      this.props.navigation.navigate('ContactModal');
    }
  }
}

const mapState = (state: RootState) => ({
  contacts: state.contacts.list,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  push: (c: Contact) => dispatch(push(c)),
  setCurrent: (c: Contact) => dispatch(setCurrent(c))
})

const connector = connect(mapState, mapDispatch);
type ReduxProps = ConnectedProps<typeof connector>

export default connector(ContactsScreen);