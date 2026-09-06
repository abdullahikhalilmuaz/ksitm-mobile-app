import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://ksitm-backend-api.onrender.com/api";

export default function QRScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [bookData, setBookData] = useState<any>(null);

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleScan = async (data: any) => {
    if (!scanning || loading) return;
    setScanning(false);
    setLoading(true);

    const scannedData = data.data;
    const accession = scannedData.includes("KSITM-")
      ? scannedData.match(/KSITM-\d+-\d+/)?.[0]
      : scannedData;

    if (!accession) {
      Alert.alert("Invalid QR", "Could not identify book. Please try again.");
      setScanning(true);
      setLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}/qr/scan/${accession}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        setBookData({
          ...response.data.data,
          accession,
        });
        setShowResult(true);
      } else {
        Alert.alert("Book Not Found", "This QR code doesn't match any book.");
        setScanning(true);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch book details",
      );
      setScanning(true);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBook = () => {
    setShowResult(false);
    router.push(`/book/${bookData.book.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 40 }} />
      </View>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleScan}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Position QR code in the frame</Text>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4B2E83" />
              <Text style={styles.loadingText}>Finding book...</Text>
            </View>
          )}
        </View>
      </CameraView>

      {/* Sexy Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <BlurView intensity={50} tint="dark" style={styles.modalOverlay}>
          <BlurView intensity={80} tint="light" style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
              </View>
              <Text style={styles.modalTitle}>Book Found!</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.bookTitle}>{bookData?.book?.title}</Text>
              <Text style={styles.bookAuthor}>
                By: {bookData?.book?.author}
              </Text>
              <View style={styles.bookDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Accession</Text>
                  <Text style={styles.detailValue}>{bookData?.accession}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          bookData?.availability?.availableCopies > 0
                            ? "#059669"
                            : "#DC2626",
                      },
                    ]}
                  >
                    {bookData?.availability?.availableCopies > 0
                      ? "Available"
                      : "Unavailable"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Copies</Text>
                  <Text style={styles.detailValue}>
                    {bookData?.availability?.availableCopies} /{" "}
                    {bookData?.availability?.totalCopies}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => setShowResult(false)}
              >
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleViewBook}
              >
                <Text style={styles.btnPrimaryText}>View Book →</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F3FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  closeButton: { padding: 4 },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#4B2E83",
    borderRadius: 16,
  },
  scanText: { color: "#FFFFFF", fontSize: 14, marginTop: 20, opacity: 0.8 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: "#FFFFFF", fontSize: 16, marginTop: 12 },
  permissionText: { fontSize: 16, color: "#6B7280", marginBottom: 16 },
  permissionButton: {
    backgroundColor: "#4B2E83",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: { color: "#FFFFFF", fontWeight: "600" },

  // Sexy Modal
  modalOverlay: { flex: 1, alignItems: "center", justifyContent: "center" },
  modalCard: {
    width: "85%",
    maxWidth: 380,
    padding: 24,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#4B2E83",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: { alignItems: "center", marginBottom: 20 },
  successIcon: { marginBottom: 8 },
  modalTitle: { fontSize: 24, fontWeight: "700", color: "#1A1A2E" },
  modalBody: { marginBottom: 20 },
  bookTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
  },
  bookDetails: {
    marginTop: 16,
    backgroundColor: "rgba(245,243,255,0.5)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(75,46,131,0.1)",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  detailLabel: { fontSize: 13, color: "#6B7280" },
  detailValue: { fontSize: 13, fontWeight: "600", color: "#1A1A2E" },
  modalActions: { flexDirection: "row", gap: 12 },
  btnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  btnSecondaryText: { color: "#6B7280", fontWeight: "600" },
  btnPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#4B2E83",
    alignItems: "center",
  },
  btnPrimaryText: { color: "#FFFFFF", fontWeight: "600" },
});
