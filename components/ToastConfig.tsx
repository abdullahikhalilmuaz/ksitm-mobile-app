// components/ToastConfig.tsx
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={styles.toastContainer}>
      <Ionicons name="checkmark-circle" size={28} color="#059669" />
      <View style={styles.textContainer}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastMessage}>{text2}</Text>
      </View>
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View style={styles.toastContainer}>
      <Ionicons name="close-circle" size={28} color="#DC2626" />
      <View style={styles.textContainer}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastMessage}>{text2}</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  toastMessage: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
});