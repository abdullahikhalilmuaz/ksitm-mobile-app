import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          router.replace("/login");
        },
      },
    ]);
  };

  const activeLoans = loans.filter(
    (loan: any) => loan.status === "active",
  ).length;
  const totalFines = loans.reduce(
    (sum: number, loan: any) => sum + (loan.fine || 0),
    0,
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>

          <Text style={styles.userName}>{user?.name || "Student"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.userIdBadge}>
            <Ionicons name="card-outline" size={16} color="#4B2E83" />
            <Text style={styles.userIdText}>{user?.libraryId || "No ID"}</Text>
          </View>

          {/* Digital Library Card with Real QR */}
          <BlurView intensity={20} tint="light" style={styles.libraryCard}>
            <Text style={styles.libraryCardTitle}>📇 Digital Library Card</Text>
            <View style={styles.libraryCardContent}>
              <View style={styles.qrPlaceholder}>
                {user?.libraryId ? (
                  <QRCode
                    value={`${user?.libraryId}`}
                    size={80}
                    color="#4B2E83"
                    backgroundColor="white"
                  />
                ) : (
                  <Ionicons name="qr-code" size={80} color="#4B2E83" />
                )}
              </View>
              <View style={styles.libraryCardInfo}>
                <Text style={styles.libraryCardName}>{user?.name}</Text>
                <Text style={styles.libraryCardId}>ID: {user?.libraryId}</Text>
                <Text style={styles.libraryCardDept}>
                  {user?.department || "Student"}
                </Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeLoans}</Text>
            <Text style={styles.statLabel}>Active Loans</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{loans.length}</Text>
            <Text style={styles.statLabel}>Total Borrowed</Text>
          </View>
          <View style={styles.statCard}>
            <Text
              style={[styles.statNumber, totalFines > 0 && styles.fineText]}
            >
              ₦{totalFines}
            </Text>
            <Text style={styles.statLabel}>Total Fines</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("Edit Profile", "Coming soon!")}
          >
            <Ionicons name="person-outline" size={22} color="#4B2E83" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#D1D5DB"
              style={styles.menuArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/history")}
          >
            <Ionicons name="book-outline" size={22} color="#4B2E83" />
            <Text style={styles.menuText}>Borrowing History</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#D1D5DB"
              style={styles.menuArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/notification")}
          >
            <Ionicons name="notifications-outline" size={22} color="#4B2E83" />
            <Text style={styles.menuText}>Notifications</Text>
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>3</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#D1D5DB"
              style={styles.menuArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("Help & Support", "Coming soon!")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#4B2E83" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#D1D5DB"
              style={styles.menuArrow}
            />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
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
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#4B2E83",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4B2E83",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  userIdBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  userIdText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B2E83",
    marginLeft: 6,
  },
  libraryCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  libraryCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B2E83",
    marginBottom: 12,
  },
  libraryCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  qrPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  libraryCardInfo: {
    flex: 1,
  },
  libraryCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  libraryCardId: {
    fontSize: 13,
    color: "#6B7280",
  },
  libraryCardDept: {
    fontSize: 13,
    color: "#6B7280",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  fineText: {
    color: "#DC2626",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A2E",
    marginLeft: 12,
    flex: 1,
  },
  menuArrow: {
    marginLeft: "auto",
  },
  menuBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  menuBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 5,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 20,
  },
});
