import { StyleSheet } from "react-native";

export const CommonStyles = StyleSheet.create({
  screenContainer: {
    margin: 5,
    marginHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  container: {
    marginTop: 15,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  columns: {
    flexDirection: "row",
  },
  columnElement: {
    flexGrow: 1,
  },
  boldText: {
    fontWeight: 'bold',
  }
});