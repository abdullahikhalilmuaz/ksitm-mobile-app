
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
export function Header({ title, showBack }: { title: string; showBack?: boolean }) {
  const router = useRouter();
  return (
    <View className="flex-row items-center p-4 bg-white border-b border-gray-100">
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-purple-600">←</Text>
        </TouchableOpacity>
      )}
      <Text className="text-xl font-bold text-purple-700">{title}</Text>
    </View>
  );
}
