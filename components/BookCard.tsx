
import { View, Text } from 'react-native';
export function BookCard({ title, author, available }: { title: string; author: string; available: number }) {
  return (
    <View className="bg-white p-4 rounded-xl shadow border border-gray-100 mb-3">
      <Text className="font-semibold">{title}</Text>
      <Text className="text-sm text-gray-600">{author}</Text>
      <Text className={`text-sm ${available > 0 ? 'text-green-600' : 'text-red-600'}`}>
        Available: {available}
      </Text>
    </View>
  );
}
