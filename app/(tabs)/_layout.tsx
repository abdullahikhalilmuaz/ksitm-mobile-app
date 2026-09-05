import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4B2E83",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: "My Library",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "library" : "library-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reserved",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 24,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderTopWidth: 0,
    shadowColor: "#4B2E83",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
      },
    }),
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});
