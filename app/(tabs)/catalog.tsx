import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function CatalogScreen() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredBooks(books);
    } else {
      const lower = search.toLowerCase();
      const filtered = books.filter(
        (book: any) =>
          book.title.toLowerCase().includes(lower) ||
          book.author.toLowerCase().includes(lower) ||
          (book.isbn && book.isbn.includes(search)),
      );
      setFilteredBooks(filtered);
    }
  }, [search, books]);

  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/books`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBooks(res.data.data || []);
      setFilteredBooks(res.data.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const handleBookPress = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 Search</Text>
        <Text style={styles.subtitle}>
          {filteredBooks.length} books available
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, author..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B2E83" />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      ) : (
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
          {filteredBooks.length === 0 ? (
            <Animated.View entering={FadeInUp} style={styles.emptyState}>
              <Ionicons name="book-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No books found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search</Text>
            </Animated.View>
          ) : (
            filteredBooks.map((book: any, index) => (
              <Animated.View
                key={book._id}
                entering={FadeInUp.delay(index * 50)}
              >
                <TouchableOpacity
                  style={styles.bookCard}
                  onPress={() => handleBookPress(book._id)}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={30} tint="light" style={styles.bookBlur}>
                    <View style={styles.bookCardContent}>
                      <View style={styles.bookIcon}>
                        <Text style={styles.bookEmoji}>📖</Text>
                      </View>
                      <View style={styles.bookInfo}>
                        <Text style={styles.bookTitle} numberOfLines={1}>
                          {book.title}
                        </Text>
                        <Text style={styles.bookAuthor} numberOfLines={1}>
                          {book.author}
                        </Text>
                        <View style={styles.bookMeta}>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>
                              {book.category?.name || "General"}
                            </Text>
                          </View>
                          <View style={styles.dot} />
                          <Text style={styles.bookCopies}>
                            {book.availableCopies} of {book.totalCopies}{" "}
                            available
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#D1D5DB"
                      />
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </ScrollView>
      )}
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
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 16,
    shadowColor: "#4B2E83",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A2E",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  bookCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  bookBlur: {
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  bookCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  bookEmoji: {
    fontSize: 24,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  bookAuthor: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 1,
  },
  bookMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4B2E83",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 6,
  },
  bookCopies: {
    fontSize: 11,
    color: "#6B7280",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
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
