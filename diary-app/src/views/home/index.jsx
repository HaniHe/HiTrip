import { StyleSheet, Image, View, Button } from "react-native";
import TitleBar from "./components/titleBar"
import List from "../List/waterfallList"
export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <TitleBar />
      <List></List>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    justifyContent: "space-around",
    width: "50%",
    height: "20%",
    justifyContent: "space-around",
  },
});