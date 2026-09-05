import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const API_URL = "http://localhost:5000/api";
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");
      const userData = userStr ? JSON.parse(userStr) : null;
      setUser(userData);

      if (token) {
        const res = await axios.get(`${API_URL}/loans/my-loans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const activeLoans = loans.filter(
    (loan: any) => loan.status === "active",
  ).length;
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const quickActions = [
    {
      id: 1,
      icon: "book-outline",
      label: "My Loans",
      route: "/(tabs)/loans",
      color: "#4B2E83",
    },
    {
      id: 2,
      icon: "bookmark-outline",
      label: "Reservations",
      route: "/(tabs)/reservations",
      color: "#F58220",
    },
    {
      id: 3,
      icon: "scan-outline",
      label: "Scan QR",
      route: "/qr-scanner",
      color: "#059669",
    },
    {
      id: 4,
      icon: "person-outline",
      label: "Profile",
      route: "/(tabs)/profile",
      color: "#4B2E83",
    },
  ];

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
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()} 👋</Text>
            <Text style={styles.userName}>{user?.name || "Student"}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <BlurView intensity={20} tint="light" style={styles.blurCircle}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#4B2E83"
              />
              <View style={styles.notifBadge} />
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
          <BlurView intensity={30} tint="light" style={styles.statCard}>
            <Text style={styles.statNumber}>{activeLoans}</Text>
            <Text style={styles.statLabel}>Active Loans</Text>
          </BlurView>
          <BlurView intensity={30} tint="light" style={styles.statCard}>
            <Text style={styles.statNumber}>{loans.length}</Text>
            <Text style={styles.statLabel}>Total Books</Text>
          </BlurView>
          <BlurView intensity={30} tint="light" style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Fines</Text>
          </BlurView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInUp.delay(300)}
          style={styles.actionsSection}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
              >
                <BlurView intensity={40} tint="light" style={styles.actionBlur}>
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={28}
                      color={action.color}
                    />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Active Loans Card */}
        {activeLoans > 0 && (
          <Animated.View
            entering={FadeInUp.delay(400)}
            style={styles.loansSection}
          >
            <Text style={styles.sectionTitle}>📖 Continue Reading</Text>
            {loans
              .filter((loan: any) => loan.status === "active")
              .slice(0, 2)
              .map((loan: any) => (
                <BlurView
                  key={loan._id}
                  intensity={30}
                  tint="light"
                  style={styles.loanCard}
                >
                  <View style={styles.loanContent}>
                    <View style={styles.loanIcon}>
                      <Text style={styles.loanEmoji}>📚</Text>
                    </View>
                    <View style={styles.loanInfo}>
                      <Text style={styles.loanTitle}>{loan.book?.title}</Text>
                      <Text style={styles.loanAuthor}>{loan.book?.author}</Text>
                      <View style={styles.loanMeta}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color="#6B7280"
                        />
                        <Text style={styles.loanDue}>
                          Due: {new Date(loan.dueDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </BlurView>
              ))}
          </Animated.View>
        )}

        {/* Explore Section */}
        <Animated.View
          entering={FadeInUp.delay(500)}
          style={styles.exploreSection}
        >
          <BlurView intensity={40} tint="light" style={styles.exploreCard}>
            <Text style={styles.exploreTitle}>✨ Expand Your Knowledge</Text>
            <Text style={styles.exploreSub}>
              Discover thousands of books at your fingertips
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push("/(tabs)/catalog")}
            >
              <Text style={styles.exploreBtnText}>Browse Books</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </BlurView>
        </Animated.View>

        <View style={{ height: 80 }} />
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
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: "#6B7280",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A2E",
    marginTop: 2,
  },
  notificationBtn: {
    position: "relative",
  },
  blurCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  notifBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 4,
  },
  actionBlur: {
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1A1A2E",
    textAlign: "center",
  },
  loansSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  loanCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  loanContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loanIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  loanEmoji: {
    fontSize: 20,
  },
  loanInfo: {
    flex: 1,
  },
  loanTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  loanAuthor: {
    fontSize: 13,
    color: "#6B7280",
  },
  loanMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  loanDue: {
    fontSize: 12,
    color: "#6B7280",
  },
  exploreSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  exploreCard: {
    padding: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(75,46,131,0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  exploreTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  exploreSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F58220",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignSelf: "flex-start",
    gap: 8,
  },
  exploreBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
