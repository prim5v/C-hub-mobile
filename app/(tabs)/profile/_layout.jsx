// app/profile/_layout.jsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="history" />
      <Stack.Screen name="promocodes" />
      <Stack.Screen name="language" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}