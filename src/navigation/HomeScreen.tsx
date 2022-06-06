import * as React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import IScreen from '../common/screen'

import MedicationsWidget from '../modules/widgets/MedicationsWidget';
import MeasuringWidget from '../modules/widgets/MeasuringWidget';
import VisitsWidget from '../modules/widgets/VisitsWidget';

import { CommonStyles } from '../Styles.g'
import moment from 'moment';

interface IState {
  hours: number;
}

class HomeScreen extends React.Component<IScreen, IState> {
  constructor(props: IScreen) {
    super(props);
    this.state = {
      hours: moment().get('hours')
    };
  }

  render() {
    const { hours } = this.state;
    let greetings;
    if (hours >= 6 && hours < 12)
      greetings = "Доброе утро!";
    else if (hours >= 12 && hours < 18)
      greetings = "Добрый день!";
    else if (hours >= 18 && hours < 22)
      greetings = "Добрый вечер!";
    else
      greetings = "Доброй ночи!";

    return (
      <ScrollView style={CommonStyles.screenContainer}>
        <Text style={styles.greetings}>{greetings}</Text>
        <MedicationsWidget onPress={() => this.navigate("Medications")} />
        <MeasuringWidget onPress={() => this.navigate('Measurings')} />
        <VisitsWidget onPress={() => this.navigate('Visits')} />
      </ScrollView>
    )
  }

  private navigate(screen: string) {
    this.props.navigation.navigate(screen);
  }
}

const styles = StyleSheet.create({
  greetings: {
    fontWeight: 'bold',
    fontSize: 30,
  }
});

export default HomeScreen;