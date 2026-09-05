import os
from pathlib import Path

# ============ EXPO PROJECT FILES ============
expo_files = {
    # Tab Screens
    "app/(tabs)/index.tsx": """
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-purple-700">📚 Library</Text>
        <View className="mt-4 bg-purple-50 p-4 rounded-xl">
          <Text className="text-lg font-semibold">Welcome back, Student!</Text>
          <Text className="text-gray-600 mt-1">You have 2 books due in 5 days</Text>
        </View>
        <View className="mt-4 flex-row flex-wrap gap-4">
          <View className="bg-white p-4 rounded-xl shadow flex-1 min-w-[45%]">
            <Text className="text-3xl">📖</Text>
            <Text className="text-sm text-gray-600 mt-1">Borrowed: 3</Text>
          </View>
          <View className="bg-white p-4 rounded-xl shadow flex-1 min-w-[45%]">
            <Text className="text-3xl">⏰</Text>
            <Text className="text-sm text-gray-600 mt-1">Due soon: 2</Text>
          </View>
          <View className="bg-white p-4 rounded-xl shadow flex-1 min-w-[45%]">
            <Text className="text-3xl">📝</Text>
            <Text className="text-sm text-gray-600 mt-1">Reservations: 1</Text>
          </View>
          <View className="bg-white p-4 rounded-xl shadow flex-1 min-w-[45%]">
            <Text className="text-3xl">💰</Text>
            <Text className="text-sm text-gray-600 mt-1">Fines: ₦0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
""",

    "app/(tabs)/catalog.tsx": """
import { View, Text, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const books = [
  { id: '1', title: 'Introduction to Algorithms', author: 'Cormen', available: 3 },
  { id: '2', title: 'Database Systems', author: 'Elmasri', available: 2 },
  { id: '3', title: 'Computer Networks', author: 'Tanenbaum', available: 1 },
  { id: '4', title: 'Operating Systems', author: 'Silberschatz', available: 0 },
];

export default function CatalogScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-purple-700">Search Books</Text>
        <TextInput placeholder="Search by title, author..." className="border border-gray-200 rounded-xl p-3 bg-gray-50 mt-4" />
        <FlatList 
          data={books} 
          keyExtractor={item => item.id} 
          className="mt-4" 
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-xl shadow mb-3 border border-gray-100">
              <Text className="font-semibold">{item.title}</Text>
              <Text className="text-sm text-gray-600">{item.author}</Text>
              <Text className={`text-sm ${item.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Available: {item.available} {item.available === 0 && '(Reserve)'}
              </Text>
            </View>
          )} 
        />
      </View>
    </SafeAreaView>
  );
}
""",

    "app/(tabs)/loans.tsx": """
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const loans = [
  { id: '1', book: 'Introduction to Algorithms', due: '2026-09-10', status: 'Active', daysLeft: 5 },
  { id: '2', book: 'Database Systems', due: '2026-09-15', status: 'Active', daysLeft: 10 },
];

export default function LoansScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-purple-700">My Loans</Text>
        <FlatList 
          data={loans} 
          keyExtractor={item => item.id} 
          className="mt-4" 
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-xl shadow mb-3 border border-gray-100">
              <Text className="font-semibold">{item.book}</Text>
              <Text className="text-sm text-gray-600">Due: {item.due}</Text>
              <View className="flex-row justify-between mt-1">
                <Text className="text-sm text-green-600">Status: {item.status}</Text>
                <Text className="text-sm text-orange-600">{item.daysLeft} days left</Text>
              </View>
            </View>
          )} 
        />
      </View>
    </SafeAreaView>
  );
}
""",

    "app/(tabs)/profile.tsx": """
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 items-center">
        <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-xl font-bold mt-2">Student Name</Text>
        <Text className="text-gray-600">Library ID: KSITM-2026-001</Text>
        <Text className="text-gray-600">Department: Computer Science</Text>
        
        <View className="mt-6 w-full bg-purple-50 p-4 rounded-xl">
          <Text className="font-semibold text-center">📇 Digital Library Card</Text>
          <View className="mt-2 bg-white p-6 rounded-lg items-center">
            <Text className="text-6xl">📱</Text>
            <Text className="text-center text-sm text-gray-500 mt-2">Scan to borrow books</Text>
          </View>
        </View>
        
        <TouchableOpacity className="mt-6 bg-red-500 px-6 py-3 rounded-lg w-full">
          <Text className="text-white text-center font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
""",

    "app/(tabs)/notifications.tsx": """
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const notifications = [
  { id: '1', message: '📚 2 books due in 3 days', time: '2 hours ago' },
  { id: '2', message: '✅ Your reservation for "Database Systems" is ready', time: '1 day ago' },
  { id: '3', message: '⏰ Overdue: "Computer Networks" due yesterday', time: '2 days ago' },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-purple-700">Notifications</Text>
        <FlatList 
          data={notifications} 
          keyExtractor={item => item.id} 
          className="mt-4" 
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-xl shadow mb-3 border border-gray-100">
              <Text>{item.message}</Text>
              <Text className="text-xs text-gray-500 mt-1">{item.time}</Text>
            </View>
          )} 
        />
      </View>
    </SafeAreaView>
  );
}
""",

    # Screens
    "app/book/[id].tsx": """
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-purple-600">← Back</Text>
      </TouchableOpacity>
      
      <Text className="text-2xl font-bold text-purple-700">Book Details</Text>
      <View className="mt-4 bg-white p-4 rounded-xl shadow border border-gray-100">
        <Text className="font-semibold">Book ID: {id}</Text>
        <Text className="mt-2 text-gray-600">Title: Introduction to Algorithms</Text>
        <Text className="text-gray-600">Author: Thomas H. Cormen</Text>
        <Text className="text-gray-600">ISBN: 9780262033848</Text>
        <Text className="text-gray-600">Category: Computer Science</Text>
        <Text className="text-green-600 mt-2">Status: Available</Text>
        
        <TouchableOpacity className="mt-4 bg-purple-600 p-3 rounded-lg">
          <Text className="text-white text-center font-semibold">Reserve Book</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
""",

    "app/qr-scanner.tsx": """
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function QRScannerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
      <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-4">
        <Text className="text-purple-600">← Back</Text>
      </TouchableOpacity>
      
      <View className="w-64 h-64 border-4 border-purple-600 rounded-xl items-center justify-center bg-gray-50">
        <Text className="text-6xl">📷</Text>
      </View>
      <Text className="mt-4 text-gray-600 font-semibold">Scan QR code on book</Text>
      <Text className="text-sm text-gray-500 mt-2">Point camera at library QR code</Text>
      
      <TouchableOpacity className="mt-6 bg-purple-600 px-6 py-3 rounded-lg">
        <Text className="text-white font-semibold">Start Scanning</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
""",

    # Components
    "components/BookCard.tsx": """
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
""",

    "components/SearchBar.tsx": """
import { TextInput } from 'react-native';
export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: { value: string; onChangeText: (text: string) => void; placeholder?: string }) {
  return (
    <TextInput 
      value={value} 
      onChangeText={onChangeText} 
      placeholder={placeholder} 
      className="border border-gray-200 rounded-xl p-3 bg-gray-50" 
    />
  );
}
""",

    "components/LoanCard.tsx": """
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
""",

    "components/Header.tsx": """
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
""",

    # Services
    "services/api.ts": """
export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const api = {
  get: async (endpoint: string) => { const res = await fetch(`${API_BASE}${endpoint}`); return res.json(); },
  post: async (endpoint: string, data: any) => { const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }); return res.json(); }
};
""",

    "services/books.ts": """
import { api } from './api';
export const booksService = {
  getAll: () => api.get('/books'),
  getById: (id: string) => api.get(`/books/${id}`),
  search: (query: string) => api.get(`/books/search?q=${query}`),
};
""",

    "services/auth.ts": """
export const authService = {
  login: async (email: string, password: string) => {
    // Mock login
    if (email && password) {
      return { success: true, user: { email, name: 'Student User' } };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  logout: () => {},
  getCurrentUser: () => ({ name: 'Student User', id: 'KSITM-2026-001' }),
};
""",

    "services/loans.ts": """
import { api } from './api';
export const loansService = {
  getMyLoans: () => api.get('/loans/mine'),
  borrow: (bookId: string) => api.post('/loans', { bookId }),
  return: (loanId: string) => api.post(`/loans/${loanId}/return`),
  renew: (loanId: string) => api.post(`/loans/${loanId}/renew`),
};
""",
}

def create_files(base_path, files_dict):
    """Create files without overwriting existing ones"""
    created = 0
    skipped = 0
    
    for file_path, content in files_dict.items():
        full_path = Path(base_path) / file_path
        if not full_path.exists():
            full_path.parent.mkdir(parents=True, exist_ok=True)
            full_path.write_text(content, encoding='utf-8')
            print(f"  ✅ Created: {file_path}")
            created += 1
        else:
            print(f"  ⏭️ Skipped (already exists): {file_path}")
            skipped += 1
    
    return created, skipped

def main():
    print("\n" + "="*60)
    print("🚀 ADDING EXPO REACT NATIVE LIBRARY FEATURES")
    print("="*60 + "\n")
    
    # Check if we're in the right directory
    cwd = Path.cwd()
    print(f"📂 Working directory: {cwd}")
    
    # Check if Expo project exists
    has_expo = (cwd / "package.json").exists() and (cwd / "app.json").exists()
    
    if has_expo:
        print("✅ Expo project detected!")
    else:
        print("⚠️ This doesn't look like an Expo project.")
        print("   Make sure you're running this in your new-project/ folder.")
        
        response = input("\nContinue anyway? (y/n): ").strip().lower()
        if response != 'y':
            print("Exiting...")
            return
    
    print("\n📁 Creating Expo library management files...\n")
    
    created, skipped = create_files(".", expo_files)
    
    print("\n" + "="*60)
    print("✅ ALL DONE!")
    print("="*60)
    
    print(f"\n📊 Summary: {created} files created, {skipped} files skipped")
    
    print("\n📂 Added folders and files:")
    print("  📱 Expo Screens:")
    print("     - (tabs)/index (Home)")
    print("     - (tabs)/catalog (Search Books)")
    print("     - (tabs)/loans (My Loans)")
    print("     - (tabs)/profile")
    print("     - (tabs)/notifications")
    print("     - book/[id] (Book Details)")
    print("     - qr-scanner")
    print("\n  📁 Components:")
    print("     - BookCard, SearchBar, LoanCard, Header")
    print("\n  🔧 Services:")
    print("     - api, books, auth, loans")
    
    print("\n🚀 NEXT STEP:")
    print("  npm start")
    print("  Scan QR code with Expo Go app")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    main()