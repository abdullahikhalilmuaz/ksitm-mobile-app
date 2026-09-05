import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import { registerForPushNotifications } from "../../services/notification.service";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          router.replace("/login");
        },
      },
    ]);
  };

  const handleNotifications = async () => {
    if (!notifications) {
      const token = await registerForPushNotifications();
      if (token) {
        setNotifications(true);
      }
    } else {
      setNotifications(false);
      await AsyncStorage.removeItem("pushToken");
      Alert.alert("Disabled", "Push notifications turned off");
    }
  };

  const isDark = theme === "dark";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Account
          </Text>
          <BlurView
            intensity={isDark ? 40 : 30}
            tint={colors.blur}
            style={[styles.card, { borderColor: colors.border }]}
          >
            <View style={styles.accountRow}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: isDark ? "#4B2E83" : "#4B2E83" },
                ]}
              >
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
              <View style={styles.accountInfo}>
                <Text style={[styles.accountName, { color: colors.text }]}>
                  {user?.name || "Student"}
                </Text>
                <Text
                  style={[styles.accountEmail, { color: colors.textSecondary }]}
                >
                  {user?.email}
                </Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Preferences
          </Text>
          <BlurView
            intensity={isDark ? 40 : 30}
            tint={colors.blur}
            style={[styles.card, { borderColor: colors.border }]}
          >
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabel}>
                <Ionicons
                  name={isDark ? "moon" : "moon-outline"}
                  size={20}
                  color="#4B2E83"
                />
                <Text style={[styles.toggleText, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#E5E7EB", true: "#4B2E83" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabel}>
                <Ionicons
                  name={
                    notifications ? "notifications" : "notifications-outline"
                  }
                  size={20}
                  color="#4B2E83"
                />
                <Text style={[styles.toggleText, { color: colors.text }]}>
                  Push Notifications
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={handleNotifications}
                trackColor={{ false: "#E5E7EB", true: "#4B2E83" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </BlurView>
        </View>

        {/* Library Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Library
          </Text>
          <BlurView
            intensity={isDark ? 40 : 30}
            tint={colors.blur}
            style={[styles.card, { borderColor: colors.border }]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Ionicons name="card-outline" size={20} color="#4B2E83" />
              <Text style={[styles.menuText, { color: colors.text }]}>
                Digital Library Card
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#D1D5DB"
                style={styles.menuArrow}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="book-outline" size={20} color="#4B2E83" />
              <Text style={[styles.menuText, { color: colors.text }]}>
                Borrowing History
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#D1D5DB"
                style={styles.menuArrow}
              />
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
  },
  accountEmail: {
    fontSize: 13,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  menuText: {
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
  },
  menuArrow: {
    marginLeft: "auto",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  toggleLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 15,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
  },
});
