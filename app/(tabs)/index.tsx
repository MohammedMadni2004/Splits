import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/groupStore';
import { calculateTotals } from '@/utils/calculateTotals';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

export default function HomeScreen() {
  const isHydrated = useGroupStore((state) => state.isHydrated);
  const groups = useGroupStore((state) => state.groups);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (isHydrated && isLoading) {
      setIsLoading(false);
    }
  }, [isHydrated, isLoading]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { totalAmount, totalOwed, totalPaid } = calculateTotals(item);
          return (
            <View style={tw`bg-gray-200 p-4 mb-3 rounded`}>
              <Text style={tw`text-lg font-bold`}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>Members: {item.members.map((m) => m.name).join(', ')}</Text>
              <Text style={tw`mt-2 text-sm`}>Total Amount: ₹{totalAmount}</Text>
              <Text>Total Owed: ₹{totalOwed}</Text>
              <Text>Total Paid: ₹{totalPaid}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={tw`text-center text-gray-500 mt-4`}>No groups available. Add a new group!</Text>
        }
      />
      <TouchableOpacity
        style={tw`absolute bottom-8 right-8 bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow-lg`}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={tw`text-white text-2xl`}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
