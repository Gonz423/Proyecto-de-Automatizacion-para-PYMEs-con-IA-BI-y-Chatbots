import { StyleSheet } from "react-native";
import { colors } from "./theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: colors.textPrimary,
  },
});

export default styles;
