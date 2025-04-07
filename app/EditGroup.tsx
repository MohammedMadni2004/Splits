import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGroupStore } from '@/store/groupStore';
import tw from 'twrnc';

export default function EditGroup() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId } = route.params as { groupId: string };

  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));
  const editGroup = useGroupStore((state) => state.editGroup);

  const [groupName, setGroupName] = useState(group?.name || '');
  const [groupDescription, setGroupDescription] = useState(group?.description || '');

  const handleSave = () => {
    if (!groupName.trim()) {
      Alert.alert('Validation Error', 'Group name is required');
      return;
    }

    if (!group) {
      Alert.alert('Error', 'Group not found');
      return;
    }

    const updatedGroup = {
      ...group,
      name: groupName.trim(),
      description: groupDescription.trim(),
    };

    editGroup(groupId, updatedGroup);
    Alert.alert('Success', 'Group updated successfully!');
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>Edit Group</Text>
      <TextInput
        style={tw`border rounded-lg p-3 mb-4`}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={tw`border rounded-lg p-3 mb-4`}
        placeholder="Group Description"
        value={groupDescription}
        onChangeText={setGroupDescription}
      />
      <TouchableOpacity style={tw`rounded-lg p-4 bg-blue-500`} onPress={handleSave}>
        <Text style={tw`text-center text-white font-bold`}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
