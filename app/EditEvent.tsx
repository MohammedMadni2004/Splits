import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGroupStore } from '@/store/groupStore';
import tw from 'twrnc';

export default function EditEvent() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, eventId } = route.params as { groupId: string; eventId: string };
  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));
  const event = group?.events.find((e) => e.id === eventId);
  const editEvent = useGroupStore((state) => state.editEvent);

  const [eventTitle, setEventTitle] = useState(event?.title || '');
  const [eventDescription, setEventDescription] = useState(event?.description || '');

  const handleSave = () => {
    if (!eventTitle.trim()) {
      Alert.alert('Validation Error', 'Event title is required');
      return;
    }

    editEvent(groupId, eventId, { title: eventTitle.trim(), description: eventDescription.trim() });
    Alert.alert('Success', 'Event updated successfully!');
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>Edit Event</Text>
      <TextInput
        style={tw`border rounded-lg p-3 mb-4`}
        placeholder="Event Title"
        value={eventTitle}
        onChangeText={setEventTitle}
      />
      <TextInput
        style={tw`border rounded-lg p-3 mb-4`}
        placeholder="Event Description"
        value={eventDescription}
        onChangeText={setEventDescription}
      />
      <TouchableOpacity style={tw`rounded-lg p-4 bg-blue-500`} onPress={handleSave}>
        <Text style={tw`text-center text-white font-bold`}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
