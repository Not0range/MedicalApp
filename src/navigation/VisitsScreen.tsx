import moment from 'moment';
import * as React from 'react';
import { TouchableOpacity, FlatList, View, Text, Button, Linking, Modal, BackHandler, NativeEventSubscription } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import IScreen from '../common/screen';
import Visit from '../common/visit';
import { push, setCurrent } from '../modules/slices/visitsSlice';
import { AppDispatch, RootState } from '../modules/store';

import { CommonStyles } from '../Styles.g'

interface IState {
  modalVisible: boolean;
  current: number;
  subscription: NativeEventSubscription | undefined
}

type IProps = ReduxProps & IScreen;

class VisitsScreen extends React.Component<IProps, IState> {
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
                this.props.setCurrent(this.props.visits[this.state.current]);
                this.props.navigation.navigate('VisitModal');
                this.setState({ modalVisible: false, current: -1 });
              }}>
                <Text style={CommonStyles.text}>Открыть</Text>
              </TouchableOpacity>
              {this.state.current != -1 && this.props.visits[this.state.current].doctor?.tel != '' ?
              <TouchableOpacity style={{margin: 15}} 
              onPress={ev => {
                Linking.openURL(`tel:${this.props.visits[this.state.current].doctor?.tel}`);
                this.setState({ modalVisible: false, current: -1 });
              }}>
                <Text style={CommonStyles.text}>Позвонить на личный номер</Text>
              </TouchableOpacity> : null}
              {this.state.current != -1 && this.props.visits[this.state.current].doctor?.workTel != '' ?
              <TouchableOpacity style={{margin: 15}}
              onPress={ev => {
                Linking.openURL(`tel:${this.props.visits[this.state.current].doctor?.workTel}`);
                this.setState({ modalVisible: false, current: -1});
              }}>
                <Text style={CommonStyles.text}>Позвонить на рабочий номер</Text>
              </TouchableOpacity> : null}
            </View>
          </View>
        </Modal>

        <View style={CommonStyles.columns}>
          <Text style={[CommonStyles.columnElement, CommonStyles.boldText, CommonStyles.text]}>
            Врач
          </Text>
          <Text style={[CommonStyles.boldText, CommonStyles.text]}>Дата/время посещения</Text>
        </View>
        <FlatList
        data={this.props.visits}
        renderItem={({index, item}) => (
          <TouchableOpacity style={[CommonStyles.columns, CommonStyles.container]}
          onPress={ev => this.visitTouch(index)}>
            <View style={CommonStyles.columnElement}>
              <Text style={CommonStyles.text}>{item.doctor?.name}</Text>
              <Text style={CommonStyles.text}>{item.doctor?.position}</Text>
            </View>
            <View>
              <Text style={CommonStyles.text}>
                {`${item.date.day.toString().padStart(2, '0')}.${item.date.month.toString().padStart(2, '0')}.${item.date.year}`}
                </Text>
              <Text style={CommonStyles.text}>
                {`${item.date.time.hours.toString().padStart(2, '0')}:${item.date.time.minutes.toString().padStart(2, '0')}`}
                </Text>
            </View>
          </TouchableOpacity>
        )}/>
        <Button title='Добавить' onPress={event => this.addVis()}/>
      </View>
    )
  }

  private addVis(): void {
    const t = moment();
    this.props.setCurrent({ id: -1, doctor: undefined, date: {
      day: t.get('D'), month: t.get('M') + 1, year: t.get('y'), time: {
        hours: 0,
        minutes: 0
      }}});
    this.props.navigation.navigate('VisitModal')
  }
  private backHandler(): boolean {
    if (this.state.modalVisible) {
      this.setState({ modalVisible: false });
      return true;
    }
    return false;
  }
  private visitTouch(index: number) {
    if (this.props.visits[index].doctor?.tel != '' || 
    this.props.visits[index].doctor?.workTel != '' )
      this.setState({ 
        modalVisible: true, 
        current: index, 
        subscription: BackHandler.addEventListener('hardwareBackPress', () => this.backHandler()) });
    else {
      this.props.setCurrent(this.props.visits[index]);
      this.props.navigation.navigate('VisitModal');
    }
  }
}

const mapState = (state: RootState) => ({
  visits: state.visits.list,
});

const mapDispatch = (dispatch: AppDispatch) => ({
  setCurrent: (v: Visit) => dispatch(setCurrent(v))
})

const connector = connect(mapState, mapDispatch);
type ReduxProps = ConnectedProps<typeof connector>

export default connector(VisitsScreen);