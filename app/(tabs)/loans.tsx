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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function LoansScreen() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/loans/my-loans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLoans();
    setRefreshing(false);
  };

  const getDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const activeLoans = loans.filter((loan: any) => loan.status === "active");
  const historyLoans = loans.filter((loan: any) => loan.status !== "active");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4B2E83";
      case "overdue":
        return "#DC2626";
      case "returned":
        return "#059669";
      default:
        return "#6B7280";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "active":
        return "#EDE9FE";
      case "overdue":
        return "#FEE2E2";
      case "returned":
        return "#D1FAE5";
      default:
        return "#F3F4F6";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.title}>My Loans</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{activeLoans.length}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{historyLoans.length}</Text>
              <Text style={styles.statLabel}>History</Text>
            </View>
          </View>
        </View>

        {/* Active Loans */}
        {activeLoans.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Currently Reading</Text>
            {activeLoans.map((loan: any) => {
              const daysLeft = getDaysLeft(loan.dueDate);
              const isUrgent = daysLeft <= 3 && daysLeft >= 0;
              const isOverdue = daysLeft < 0;

              return (
                <View key={loan._id} style={styles.loanCard}>
                  <View style={styles.cardTop}>
                    <View style={styles.bookIcon}>
                      <Text style={styles.bookEmoji}>📖</Text>
                    </View>
                    <View style={styles.bookInfo}>
                      <Text style={styles.bookTitle} numberOfLines={1}>
                        {loan.book?.title}
                      </Text>
                      <Text style={styles.bookAuthor}>{loan.book?.author}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusBg(loan.status) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(loan.status) },
                        ]}
                      >
                        {loan.status}
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
                      <Text style={styles.dateLabel}>Due:</Text>
                      <Text style={styles.dateValue}>
                        {new Date(loan.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                    {loan.renewed && (
                      <View style={styles.renewBadge}>
                        <Ionicons
                          name="refresh-outline"
                          size={14}
                          color="#059669"
                        />
                        <Text style={styles.renewText}>Renewed</Text>
                      </View>
                    )}
                  </View>

                  {/* Due Date Countdown */}
                  <View style={styles.daysContainer}>
                    {isOverdue ? (
                      <Text style={styles.daysOverdue}>
                        ⚠️ Overdue by {Math.abs(daysLeft)} days
                      </Text>
                    ) : isUrgent ? (
                      <Text style={styles.daysUrgent}>
                        ⚠️ {daysLeft} days left
                      </Text>
                    ) : (
                      <Text style={styles.daysText}>{daysLeft} days left</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* History */}
        {historyLoans.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>History</Text>
            {historyLoans.map((loan: any) => (
              <View
                key={loan._id}
                style={[styles.loanCard, styles.historyCard]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.bookIcon}>
                    <Text style={styles.bookEmoji}>✅</Text>
                  </View>
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle} numberOfLines={1}>
                      {loan.book?.title}
                    </Text>
                    <Text style={styles.bookAuthor}>{loan.book?.author}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusBg(loan.status) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(loan.status) },
                      ]}
                    >
                      {loan.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardBottom}>
                  <View style={styles.dateRow}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color="#059669"
                    />
                    <Text style={styles.dateLabel}>Returned:</Text>
                    <Text style={styles.dateValue}>
                      {loan.returnDate
                        ? new Date(loan.returnDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </Text>
                  </View>
                  {loan.fine > 0 && (
                    <View style={styles.fineBadge}>
                      <Ionicons name="cash-outline" size={14} color="#DC2626" />
                      <Text style={styles.fineText}>₦{loan.fine}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {loans.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="book-outline" size={56} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>No loans yet</Text>
            <Text style={styles.emptySubtext}>
              Start exploring books and borrow your first one!
            </Text>
          </View>
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
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 26,
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
  loanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#4B2E83",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 4,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A2E",
    marginLeft: 2,
  },
  renewBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  renewText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#059669",
    marginLeft: 4,
  },
  daysContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  daysText: {
    fontSize: 13,
    color: "#6B7280",
  },
  daysUrgent: {
    fontSize: 13,
    color: "#D97706",
    fontWeight: "600",
  },
  daysOverdue: {
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "700",
  },
  fineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  fineText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
  },
});
