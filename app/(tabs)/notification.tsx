import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function NotificationsScreen() {
  const [notifications] = useState([
    {
      id: 1,
      title: "Book Due Soon",
      message: "Introduction to CyberSecurity is due in 2 days",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Reservation Ready",
      message: 'Your reservation for "Database Systems" is ready',
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      title: "Book Overdue",
      message: '"Computer Networks" is overdue by 3 days',
      time: "2 days ago",
      read: true,
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAll}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notifications.map((notif) => (
          <BlurView
            key={notif.id}
            intensity={30}
            tint="light"
            style={[styles.card, !notif.read && styles.unread]}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={notif.read ? "notifications-outline" : "notifications"}
                  size={24}
                  color={notif.read ? "#9CA3AF" : "#4B2E83"}
                />
              </View>
              <View style={styles.textContent}>
                <Text style={[styles.notifTitle, !notif.read && styles.unreadText]}>
                  {notif.title}
                </Text>
                <Text style={styles.notifMessage}>{notif.message}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              {!notif.read && <View style={styles.dot} />}
            </View>
          </BlurView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  markAll: {
    fontSize: 14,
    color: "#4B2E83",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  unread: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderColor: "rgba(75,46,131,0.2)",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  unreadText: {
    color: "#4B2E83",
  },
  notifMessage: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  notifTime: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4B2E83",
  },
});