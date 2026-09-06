import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    if (id) fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/books/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBook(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please login to reserve books",
        position: "bottom",
        visibilityTime: 3000,
      });
      router.push("/login");
      return;
    }

    setReserving(true);
    try {
      await axios.post(
        `${API_URL}/reservations`,
        { bookId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Toast.show({
        type: "success",
        text1: "Book Reserved ✅",
        text2: "You will be notified when ready",
        position: "bottom",
        visibilityTime: 3000,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Reservation Failed",
        text2: error.response?.data?.message || "Something went wrong",
        position: "bottom",
        visibilityTime: 3000,
      });
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4B2E83" />
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Book not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>

        <View style={styles.cover}>
          <Text style={styles.coverEmoji}>📖</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="book-outline" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{book.category?.name || "General"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="copy-outline" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{book.totalCopies} copies</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
              <Text style={[styles.metaText, { color: "#059669" }]}>
                {book.availableCopies} available
              </Text>
            </View>
          </View>

          {book.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ISBN</Text>
              <Text style={styles.detailValue}>{book.isbn || "—"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Publisher</Text>
              <Text style={styles.detailValue}>{book.publisher || "—"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Year</Text>
              <Text style={styles.detailValue}>{book.year || "—"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shelf</Text>
              <Text style={styles.detailValue}>{book.shelfLocation || "—"}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.reserveButton, book.availableCopies === 0 && styles.disabled]}
            onPress={handleReserve}
            disabled={reserving || book.availableCopies === 0}
          >
            <Text style={styles.reserveButtonText}>
              {reserving ? "Reserving..." : book.availableCopies > 0 ? "Reserve Book" : "Not Available"}
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
    backgroundColor: "#F5F3FF",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F3FF",
  },
  backButton: {
    padding: 16,
  },
  cover: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  coverEmoji: {
    fontSize: 80,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  author: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A2E",
  },
  reserveButton: {
    backgroundColor: "#4B2E83",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  reserveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabled: {
    backgroundColor: "#9CA3AF",
  },
});