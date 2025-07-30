import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'


export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="screens/children" />
        <Stack.Screen name="screens/detect" />
        <Stack.Screen name="screens/resources" />
      </Stack>
    </ClerkProvider>
  );
}
