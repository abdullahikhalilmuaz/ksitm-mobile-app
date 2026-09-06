import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Animated, { FadeInUp } from "react-native-reanimated";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function ReservationsScreen() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/reservations/my-reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  };

  const handleCancel = async (id: string) => {
    Alert.alert("Cancel Reservation", "Are you sure you want to cancel?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await axios.delete(`${API_URL}/reservations/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchReservations();
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  const getStatus = (status: string) => {
    const configs = {
      pending: {
        color: "#D97706",
        bg: "#FEF3C7",
        icon: "time-outline",
        label: "Pending",
      },
      ready: {
        color: "#059669",
        bg: "#D1FAE5",
        icon: "checkmark-circle-outline",
        label: "Ready",
      },
      collected: {
        color: "#4B2E83",
        bg: "#EDE9FE",
        icon: "book-outline",
        label: "Collected",
      },
      cancelled: {
        color: "#6B7280",
        bg: "#F3F4F6",
        icon: "close-circle-outline",
        label: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>🔖 Reservations</Text>
        <Text style={styles.subtitle}>
          {
            reservations.filter(
              (r: any) => r.status === "pending" || r.status === "ready",
            ).length
          }{" "}
          active
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
        {reservations.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No reservations</Text>
            <Text style={styles.emptySubtext}>
              Reserve books from the catalog
            </Text>
          </View>
        ) : (
          reservations.map((res: any, index) => {
            const status = getStatus(res.status);
            return (
              <Animated.View
                key={res._id}
                entering={FadeInUp.delay(index * 80)}
              >
                <BlurView intensity={30} tint="light" style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.bookIcon}>
                      <Text style={styles.bookEmoji}>📚</Text>
                    </View>
                    <View style={styles.bookInfo}>
                      <Text style={styles.bookTitle} numberOfLines={1}>
                        {res.book?.title}
                      </Text>
                      <Text style={styles.bookAuthor}>{res.book?.author}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: status.bg },
                      ]}
                    >
                      <Ionicons
                        name={status.icon as any}
                        size={12}
                        color={status.color}
                      />
                      <Text
                        style={[styles.statusText, { color: status.color }]}
                      >
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBottom}>
                    <View style={styles.dateRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#6B7280"
                      />
                      <Text style={styles.dateText}>
                        {new Date(res.reservationDate).toLocaleDateString()}
                      </Text>
                    </View>
                    {res.position > 0 && (
                      <View style={styles.positionBadge}>
                        <Text style={styles.positionText}>
                          #{res.position} in queue
                        </Text>
                      </View>
                    )}
                    {res.status === "pending" && (
                      <TouchableOpacity onPress={() => handleCancel(res._id)}>
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#DC2626"
                        />
                      </TouchableOpacity>
                    )}
                    {res.status === "ready" && (
                      <View style={styles.readyBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#059669"
                        />
                        <Text style={styles.readyText}>Ready</Text>
                      </View>
                    )}
                  </View>
                </BlurView>
              </Animated.View>
            );
          })
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
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: "700", color: "#1A1A2E" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 2 },
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
  cardTop: { flexDirection: "row", alignItems: "center" },
  bookIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bookEmoji: { fontSize: 20 },
  bookInfo: { flex: 1, marginRight: 8 },
  bookTitle: { fontSize: 15, fontWeight: "600", color: "#1A1A2E" },
  bookAuthor: { fontSize: 13, color: "#6B7280" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statusText: { fontSize: 11, fontWeight: "600" },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateText: { fontSize: 13, color: "#6B7280" },
  positionBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  positionText: { fontSize: 11, fontWeight: "500", color: "#4B2E83" },
  readyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  readyText: { fontSize: 11, fontWeight: "600", color: "#059669" },
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
