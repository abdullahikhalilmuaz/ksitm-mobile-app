import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function NotificationScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      // Fetch loans as notifications
      const res = await axios.get(`${API_URL}/loans/my-loans`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notifs = res.data.data.map((loan: any) => ({
        id: loan._id,
        title:
          loan.status === "overdue" ? "⚠️ Book Overdue" : "📖 Book Due Soon",
        message: `"${loan.book?.title}" is ${loan.status === "overdue" ? "overdue" : "due"} on ${new Date(loan.dueDate).toLocaleDateString()}`,
        time: new Date(loan.createdAt).toLocaleDateString(),
        read: loan.status === "returned",
        type: loan.status === "overdue" ? "overdue" : "reminder",
      }));

      setNotifications(notifs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const markAsRead = (id: string) => {
    setNotifications((notifs) =>
      notifs.map((n: any) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>🔔 Notifications</Text>
        <Text style={styles.badge}>
          {notifications.filter((n: any) => !n.read).length} unread
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4B2E83"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtext}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notif: any) => (
            <TouchableOpacity
              key={notif.id}
              onPress={() => markAsRead(notif.id)}
              activeOpacity={0.7}
            >
              <BlurView
                intensity={30}
                tint="light"
                style={[styles.card, !notif.read && styles.unread]}
              >
                <View style={styles.cardContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          notif.type === "overdue" ? "#FEE2E2" : "#EDE9FE",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        notif.type === "overdue"
                          ? "alert-circle"
                          : "book-outline"
                      }
                      size={24}
                      color={notif.type === "overdue" ? "#DC2626" : "#4B2E83"}
                    />
                  </View>
                  <View style={styles.textContent}>
                    <Text
                      style={[
                        styles.notifTitle,
                        !notif.read && styles.unreadText,
                      ]}
                    >
                      {notif.title}
                    </Text>
                    <Text style={styles.notifMessage}>{notif.message}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                  {!notif.read && <View style={styles.dot} />}
                </View>
              </BlurView>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F3FF" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#1A1A2E" },
  badge: {
    backgroundColor: "#4B2E83",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
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
  cardContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: "600", color: "#1A1A2E" },
  unreadText: { color: "#4B2E83" },
  notifMessage: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  notifTime: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4B2E83" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginTop: 12,
  },
  emptySubtext: { fontSize: 14, color: "#6B7280", marginTop: 4 },
});
