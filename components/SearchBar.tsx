
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
