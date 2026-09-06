import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("100");

  const handleRegister = async () => {
    setErrorMessage("");
    console.log("REGISTER CLICKED");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        department,
        level,
        role: "student",
      });

      console.log("REGISTER RESPONSE:", response.data);

      if (response.data.success) {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        // Show success alert and then navigate to home
        Alert.alert(
          "Success! 🎉",
          `Welcome ${response.data.user.firstName}! Your account has been created.`,
          [
            {
              text: "Continue",
              onPress: () => router.replace("/(tabs)"),
            },
          ],
        );
      } else {
        Alert.alert("Registration Failed", "Something went wrong");
      }
    } catch (error: any) {
      console.log("REGISTER ERROR:", error.response?.data);

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Something went wrong";

      setErrorMessage(errorMsg);
      Alert.alert("Registration Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Create Account 📚</Text>
          <Text style={styles.subText}>Join the KSITM Library community</Text>
        </View>

        <View style={styles.form}>
          {errorMessage ? (
            <Text style={styles.errorText}>❌ {errorMessage}</Text>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="student@ksitm.edu.ng"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              placeholder="Computer Science"
              placeholderTextColor="#9CA3AF"
              value={department}
              onChangeText={(text) => setDepartment(text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Level</Text>
            <View style={styles.levelContainer}>
              {["100", "200", "300", "400", "500"].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[
                    styles.levelButton,
                    level === lvl && styles.levelButtonActive,
                  ]}
                  onPress={() => setLevel(lvl)}
                >
                  <Text
                    style={[
                      styles.levelText,
                      level === lvl && styles.levelTextActive,
                    ]}
                  >
                    {lvl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    flex: 1,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#1A1A2E",
  },
  levelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    marginRight: 8,
    marginBottom: 8,
  },
  levelButtonActive: {
    backgroundColor: "#4B2E83",
    borderColor: "#4B2E83",
  },
  levelText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  levelTextActive: {
    color: "#FFFFFF",
  },
  registerButton: {
    backgroundColor: "#4B2E83",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  loginLink: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#6B7280",
  },
  loginHighlight: {
    color: "#4B2E83",
    fontWeight: "700",
  },
});
