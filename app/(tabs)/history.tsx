import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BlurView } from "expo-blur";

const API_URL = "http://localhost:5000/api";

export default function HistoryScreen() {
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
      const returned = res.data.data.filter((loan: any) => loan.status === "returned");
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
      <View style={styles.header}>
        <Text style={styles.title}>Borrowing History</Text>
        <Text style={styles.subtitle}>{loans.length} books returned</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4B2E83" />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {loans.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={56} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No history</Text>
            <Text style={styles.emptySubtext}>Books you return will appear here</Text>
          </View>
        ) : (
          loans.map((loan: any) => (
            <BlurView key={loan._id} intensity={30} tint="light" style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.bookIcon}>
                  <Text style={styles.bookEmoji}>✅</Text>
                </View>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{loan.book?.title}</Text>
                  <Text style={styles.bookAuthor}>{loan.book?.author}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>
                      Returned: {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : "—"}
                    </Text>
                  </View>
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
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardContent: {
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
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