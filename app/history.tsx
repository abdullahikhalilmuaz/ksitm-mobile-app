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
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function HistoryScreen() {
  const router = useRouter();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/loans/my-loans`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const returned = res.data.data.filter(
        (loan: any) => loan.status === "returned",
      );
      setLoans(returned);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>📜 Borrowing History</Text>
        <Text style={styles.subtitle}>{loans.length} books returned</Text>
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
        {loans.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No history</Text>
            <Text style={styles.emptySubtext}>
              Returned books will appear here
            </Text>
          </View>
        ) : (
          loans.map((loan: any) => (
            <BlurView
              key={loan._id}
              intensity={30}
              tint="light"
              style={styles.card}
            >
              <View style={styles.cardContent}>
                <View style={styles.bookIcon}>
                  <Text style={styles.bookEmoji}>✅</Text>
                </View>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{loan.book?.title}</Text>
                  <Text style={styles.bookAuthor}>{loan.book?.author}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#6B7280"
                    />
                    <Text style={styles.metaText}>
                      Returned:{" "}
                      {loan.returnDate
                        ? new Date(loan.returnDate).toLocaleDateString()
                        : "—"}
                    </Text>
                  </View>
                  {loan.fine > 0 && (
                    <View style={styles.fineBadge}>
                      <Ionicons name="cash-outline" size={12} color="#DC2626" />
                      <Text style={styles.fineText}>₦{loan.fine}</Text>
                    </View>
                  )}
                </View>
              </View>
            </BlurView>
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
  cardContent: { flexDirection: "row", alignItems: "center" },
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
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 15, fontWeight: "600", color: "#1A1A2E" },
  bookAuthor: { fontSize: 13, color: "#6B7280" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  metaText: { fontSize: 12, color: "#6B7280" },
  fineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    gap: 4,
  },
  fineText: { fontSize: 11, fontWeight: "600", color: "#DC2626" },
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
