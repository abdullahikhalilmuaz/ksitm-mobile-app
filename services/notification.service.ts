import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    Alert.alert("Info", "Push notifications only work on physical devices");
    return null;
  }

  try {
    const permissions = (await Notifications.getPermissionsAsync()) as any;

    if (!permissions.granted) {
      const requested = (await Notifications.requestPermissionsAsync()) as any;
      if (!requested.granted) {
        Alert.alert("Permission Denied", "Push notifications are disabled");
        return null;
      }
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem("pushToken", token);
    return token;
  } catch (error) {
    console.error("Push notification error:", error);
    return null;
  }
}

export async function scheduleDueDateReminder(
  bookTitle: string,
  dueDate: string,
  loanId: string,
) {
  try {
    const due = new Date(dueDate);
    const reminderDate = new Date(due);
    reminderDate.setDate(reminderDate.getDate() - 2);

    if (reminderDate > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📚 Book Due Soon!",
          body: `"${bookTitle}" is due in 2 days. Please return or renew.`,
          data: { loanId },
          sound: true,
          priority: "high",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDate,
        },
      });
    }

    const overdueDate = new Date(due);
    overdueDate.setDate(overdueDate.getDate() + 1);

    if (overdueDate > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Book Overdue!",
          body: `"${bookTitle}" is now overdue. Please return immediately.`,
          data: { loanId },
          sound: true,
          priority: "high",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: overdueDate,
        },
      });
    }
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
}
