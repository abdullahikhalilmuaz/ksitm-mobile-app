
import { View, Text } from 'react-native';
export function LoanCard({ book, due, daysLeft }: { book: string; due: string; daysLeft: number }) {
  return (
    <View className="bg-white p-4 rounded-xl shadow border border-gray-100 mb-3">
      <Text className="font-semibold">{book}</Text>
      <Text className="text-sm text-gray-600">Due: {due}</Text>
      <Text className={`text-sm ${daysLeft > 3 ? 'text-green-600' : 'text-orange-600'}`}>
        {daysLeft} days left
      </Text>
    </View>
  );
}
