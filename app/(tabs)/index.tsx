import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/groupStore';
import { calculateTotals } from '@/utils/calculateTotals';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

export default function HomeScreen() {
  const isHydrated = useGroupStore((state) => state.isHydrated);
  const groups = useGroupStore((state) => state.groups);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const theme = useColorScheme(); // 'light' or 'dark'

  const isDark = theme === 'dark';

  const styles = {
    backgroundColor: isDark ? '#1f2937' : '#f5f7fa',
    cardBackground: isDark ? '#374151' : '#ffffff',
    textColor: isDark ? '#f1f5f9' : '#1e293b',
    buttonBackground: isDark ? '#60a5fa' : '#3b82f6',
    buttonText: isDark ? '#1f2937' : '#ffffff',
  };

  useEffect(() => {
    if (isHydrated && isLoading) {
      setIsLoading(false);
    }
  }, [isHydrated, isLoading]);

  if (isLoading) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: styles.backgroundColor }]}>
        <ActivityIndicator size="large" color={styles.textColor} />
      </View>
    );
  }

  return (
    <View style={[tw`flex-1 p-4`, { backgroundColor: styles.backgroundColor }]}>
      <Text style={[tw`text-3xl font-bold mb-6`, { color: styles.textColor }]}>Your Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { totalAmount, totalOwed, totalPaid } = calculateTotals(item);
          return (
            <TouchableOpacity
              style={[
                tw`p-4 mb-4 rounded-2xl shadow-md`,
                {
                  backgroundColor: styles.cardBackground,
                  elevation: 4,
                },
              ]}
              onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
            >
              <Text style={[tw`text-xl font-semibold`, { color: styles.textColor }]}>{item.name}</Text>
              <Text style={[tw`text-sm mb-2`, { color: styles.textColor }]}>{item.description}</Text>
              <View>
                <Text style={[tw`text-sm mb-1`, { color: styles.textColor }]}>
                  Members: {item.members.map((m) => m.name).join(', ')}
                </Text>
                <Text style={[tw`text-sm`, { color: styles.textColor }]}>Total Amount: ₹{totalAmount}</Text>
                <Text style={[tw`text-sm`, { color: styles.textColor }]}>Total Owed: ₹{totalOwed}</Text>
                <Text style={[tw`text-sm`, { color: styles.textColor }]}>Total Paid: ₹{totalPaid}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={[tw`text-center text-lg`, { color: styles.textColor }]}>
            No groups available. Add a new group!
          </Text>
        }
      />
      <TouchableOpacity
        style={[
          tw`absolute bottom-8 right-8 w-16 h-16 rounded-full items-center justify-center shadow-xl`,
          {
            backgroundColor: styles.buttonBackground,
            elevation: 6,
          },
        ]}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={[tw`text-3xl font-bold`, { color: styles.buttonText }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
