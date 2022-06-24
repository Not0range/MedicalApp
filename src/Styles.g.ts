import { Appearance, StyleSheet } from "react-native";

export const CommonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    margin: 5,
    marginHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  text: {
    fontSize: 16,
  },
  input: {
    borderColor: Appearance.getColorScheme() == 'dark' ? 'white' : 'black', 
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5
  },
  container: {
    marginTop: 15,
    borderColor: Appearance.getColorScheme() == 'dark' ? 'white' : 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  columns: {
    flexDirection: "row",
    marginHorizontal: 3
  },
  columnElement: {
    flexGrow: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    paddingLeft: 50,
    paddingRight: 50,
  },
  overlayContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignContent: 'center', 
    marginHorizontal: 50, 
    marginVertical: 50, 
  },
  table: {
    borderColor: Appearance.getColorScheme() == 'dark' ? 'white' : 'black',
    borderWidth: 1,
    padding: 10,
  }
});