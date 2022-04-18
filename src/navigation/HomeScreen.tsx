import * as React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import IScreen from '../common/screen'

import MedicationWidget from '../modules/MedicationWidget';
import MeasuringWidget from '../modules/MeasuringWidget';
import VisitsWidget from '../modules/VisitsWidget';

interface IState {
  hours: number;
}

class HomeScreen extends React.Component<IScreen, IState> {
  constructor(props: IScreen) {
    super(props);
    this.state = {
      hours: new Date().getHours()
    };
  }

  navigate(screen: string) {
    this.props.navigation.navigate(screen);
  }

  render() {
    const {hours} = this.state;
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
      <ScrollView style={styles.container}>
        <Text style={styles.greetings}>{greetings}</Text>
        <MedicationWidget onPress={() => this.navigate("Medication")}/>
        <MeasuringWidget onPress={() => this.navigate("Measuring")}/>
        <VisitsWidget onPress={() => this.navigate("Visits")}/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginHorizontal: 15,
  },
  greetings: {
    fontWeight: 'bold',
    fontSize: 30,
  }
});

export default HomeScreen;