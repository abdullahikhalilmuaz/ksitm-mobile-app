import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/ToastConfig";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen name="qr-scanner" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
      </Stack>
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}
