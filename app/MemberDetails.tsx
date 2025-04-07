import { useRoute } from '@react-navigation/native';
import { useGroupStore } from '@/store/groupStore';
import { View, Text, useColorScheme } from 'react-native';
import tw from 'twrnc';

export default function MemberDetails() {
  const route = useRoute();
  const { groupId, memberId } = route.params as { groupId: string; memberId: string };
  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));
  const member = group?.members.find((m) => m.id === memberId);

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const styles = {
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
    textColor: isDark ? '#F1F5F9' : '#1E293B',
    cardBackground: isDark ? '#1E1E2C' : '#FFFFFF',
    borderColor: isDark ? '#2C2C3E' : '#E0E0E0',
  };

  if (!member) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: styles.backgroundColor }]}>
        <Text style={[tw`text-lg`, { color: styles.textColor }]}>Member not found</Text>
      </View>
    );
  }

  return (
    <View style={[tw`flex-1 p-4`, { backgroundColor: styles.backgroundColor }]}>
      <Text style={[tw`text-2xl font-bold mb-4`, { color: styles.textColor }]}>
        {member.name}
      </Text>
      <Text style={[tw`text-base mb-2`, { color: styles.textColor }]}>Email: {member.email}</Text>
      <Text style={[tw`text-base`, { color: styles.textColor }]}>Phone: {member.phone}</Text>
    </View>
  );
}
