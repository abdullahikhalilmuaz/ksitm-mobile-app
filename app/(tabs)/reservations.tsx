import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function ReservationsScreen() {
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
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_URL}/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReservations();
    } catch (error) {
      console.error(error);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reservations</Text>
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
        {reservations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={56} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No reservations</Text>
            <Text style={styles.emptySubtext}>
              Reserve books from the catalog
            </Text>
          </View>
        ) : (
          reservations.map((res: any) => (
            <View key={res._id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.bookIcon}>
                  <Text style={styles.bookEmoji}>📚</Text>
                </View>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{res.book?.title}</Text>
                  <Text style={styles.bookAuthor}>{res.book?.author}</Text>
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
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
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
                    <Ionicons name="close-circle" size={24} color="#DC2626" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#4B2E83",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  bookAuthor: {
    fontSize: 13,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
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
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
});
