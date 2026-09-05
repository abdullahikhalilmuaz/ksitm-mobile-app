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
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation?",
      [
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
      ],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#D97706";
      case "ready":
        return "#059669";
      case "collected":
        return "#4B2E83";
      case "cancelled":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "pending":
        return "#FEF3C7";
      case "ready":
        return "#D1FAE5";
      case "collected":
        return "#EDE9FE";
      case "cancelled":
        return "#F3F4F6";
      default:
        return "#F3F4F6";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "ready":
        return "checkmark-circle-outline";
      case "collected":
        return "book-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "ellipse-outline";
    }
  };

  const activeReservations = reservations.filter(
    (r: any) => r.status === "pending" || r.status === "ready",
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4B2E83"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔖 Reservations</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{activeReservations.length}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reservations.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Active Reservations */}
        {activeReservations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📌 Active Reservations</Text>
            {activeReservations.map((res: any, index) => (
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
                        { backgroundColor: getStatusBg(res.status) },
                      ]}
                    >
                      <Ionicons
                        name={getStatusIcon(res.status)}
                        size={12}
                        color={getStatusColor(res.status)}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(res.status) },
                        ]}
                      >
                        {res.status}
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
                        {new Date(res.reservationDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
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
            ))}
          </View>
        )}

        {/* History */}
        {reservations.filter(
          (r: any) => r.status === "collected" || r.status === "cancelled",
        ).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📜 History</Text>
            {reservations
              .filter(
                (r: any) =>
                  r.status === "collected" || r.status === "cancelled",
              )
              .map((res: any, index) => (
                <Animated.View
                  key={res._id}
                  entering={FadeInUp.delay(index * 80 + 200)}
                >
                  <BlurView
                    intensity={20}
                    tint="light"
                    style={[styles.card, styles.historyCard]}
                  >
                    <View style={styles.cardTop}>
                      <View style={styles.bookIcon}>
                        <Text style={styles.bookEmoji}>
                          {res.status === "collected" ? "✅" : "❌"}
                        </Text>
                      </View>
                      <View style={styles.bookInfo}>
                        <Text style={styles.bookTitle} numberOfLines={1}>
                          {res.book?.title}
                        </Text>
                        <Text style={styles.bookAuthor}>
                          {res.book?.author}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusBg(res.status) },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(res.status) },
                          ]}
                        >
                          {res.status}
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
                          {new Date(res.reservationDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </Text>
                      </View>
                    </View>
                  </BlurView>
                </Animated.View>
              ))}
          </View>
        )}

        {/* Empty State */}
        {reservations.length === 0 && !loading && (
          <Animated.View entering={FadeInUp} style={styles.emptyState}>
            <BlurView intensity={30} tint="light" style={styles.emptyBlur}>
              <Ionicons name="bookmark-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No reservations</Text>
              <Text style={styles.emptySubtext}>
                Reserve books from the catalog
              </Text>
            </BlurView>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4B2E83",
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: -2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 12,
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
  historyCard: {
    opacity: 0.85,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bookIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bookEmoji: {
    fontSize: 20,
  },
  bookInfo: {
    flex: 1,
    marginRight: 8,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  bookAuthor: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
  },
  positionBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  positionText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#4B2E83",
  },
  readyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  readyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyBlur: {
    padding: 40,
    borderRadius: 24,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A2E",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
  },
});
