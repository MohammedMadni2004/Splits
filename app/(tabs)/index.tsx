import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/groupStore';
import { calculateTotals } from '@/utils/calculateTotals';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from '@/hooks/useThemeColor';
import tw from 'twrnc';

export default function HomeScreen() {
  const isHydrated = useGroupStore((state) => state.isHydrated);
  const groups = useGroupStore((state) => state.groups);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // Call useThemeColor unconditionally at the top level
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconBackgroundColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    if (isHydrated && isLoading) {
      setIsLoading(false);
    }
  }, [isHydrated, isLoading]);

  if (isLoading) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
      </View>
    );
  }

  return (
    <View style={[tw`flex-1 p-4`, { backgroundColor }]}>
      <Text style={[tw`text-xl font-bold mb-4`, { color: textColor }]}>Your Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { totalAmount, totalOwed, totalPaid } = calculateTotals(item);
          return (
            <TouchableOpacity
              style={[tw`p-4 mb-3 rounded`, { backgroundColor: iconBackgroundColor }]}
              onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
            >
              <Text style={[tw`text-lg font-bold`, { color: textColor }]}>{item.name}</Text>
              <Text style={{ color: textColor }}>{item.description}</Text>
              <Text style={{ color: textColor }}>Members: {item.members.map((m) => m.name).join(', ')}</Text>
              <Text style={[tw`mt-2 text-sm`, { color: textColor }]}>Total Amount: ₹{totalAmount}</Text>
              <Text style={{ color: textColor }}>Total Owed: ₹{totalOwed}</Text>
              <Text style={{ color: textColor }}>Total Paid: ₹{totalPaid}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={[tw`text-center mt-4`, { color: textColor }]}>No groups available. Add a new group!</Text>
        }
      />
      <TouchableOpacity
        style={[
          tw`absolute bottom-8 right-8 w-12 h-12 rounded-full items-center justify-center shadow-lg`,
          { backgroundColor: tintColor },
        ]}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={[tw`text-2xl`, { color: backgroundColor }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
