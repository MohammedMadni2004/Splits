import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useGroupStore } from '@/store/groupStore';
import { Member } from '@/types';
import tw from 'twrnc';

export default function CreateGroup() {
  const addGroup = useGroupStore((state) => state.addGroup);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  const addMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      Alert.alert('Validation Error', 'Name and Email are required');
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      phone: newMemberPhone.trim(),
    };

    setMembers((prev) => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Validation Error', 'Group name is required');
      return;
    }

    if (members.length === 0) {
      Alert.alert('Validation Error', 'At least one member is required');
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      description: groupDescription.trim(),
      members,
      events: [],
      payable: [],
    };

    addGroup(newGroup);

    setGroupName('');
    setGroupDescription('');
    setMembers([]);

    Alert.alert('Success', 'Group created successfully!');
  };

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>Create Group</Text>

      <TextInput
        style={tw`border border-gray-300 rounded p-2 mb-3`}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />

      <TextInput
        style={tw`border border-gray-300 rounded p-2 mb-3`}
        placeholder="Group Description"
        value={groupDescription}
        onChangeText={setGroupDescription}
      />

      <Text style={tw`text-lg font-bold mt-4 mb-2`}>Add Member</Text>

      <TextInput
        style={tw`border border-gray-300 rounded p-2 mb-2`}
        placeholder="Name"
        value={newMemberName}
        onChangeText={setNewMemberName}
      />
      <TextInput
        style={tw`border border-gray-300 rounded p-2 mb-2`}
        placeholder="Email"
        value={newMemberEmail}
        onChangeText={setNewMemberEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={tw`border border-gray-300 rounded p-2 mb-2`}
        placeholder="Phone"
        value={newMemberPhone}
        onChangeText={setNewMemberPhone}
        keyboardType="phone-pad"
      />

      <Button title="Add Member" onPress={addMember} />

      <Text style={tw`text-lg font-bold mt-5 mb-2`}>Members List</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={tw`p-2 border-b border-gray-200`}>
            {item.name} - {item.email}
          </Text>
        )}
        ListEmptyComponent={<Text style={tw`text-gray-500`}>No members added</Text>}
      />

      <View style={tw`mt-6`}>
        <Button title="Create Group" onPress={handleCreateGroup} />
      </View>
    </View>
  );
}
