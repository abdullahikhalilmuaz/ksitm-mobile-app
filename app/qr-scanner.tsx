import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QRScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);

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

  const handleScan = (data: any) => {
    if (!scanning) return;
    setScanning(false);

    const scannedData = data.data;
    const accession = scannedData.includes("KSITM-")
      ? scannedData.match(/KSITM-\d+-\d+/)?.[0]
      : scannedData;

    if (accession) {
      Alert.alert("Book Found", `Accession: ${accession}`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Invalid QR", "Could not identify book");
      setScanning(true);
    }
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
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Position QR code in the frame</Text>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  camera: {
    flex: 1,
  },
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
    backgroundColor: "transparent",
  },
  scanText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 20,
    opacity: 0.8,
  },
  permissionText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: "#4B2E83",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
