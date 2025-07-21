import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'


export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="(auth)/sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomePageScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="WelcomeScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/home"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/WelcomeScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/detect"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="screens/about"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="/(auth)"
          options={{
            headerShown: false,
          }}
        />
        
      </Stack>
    </ClerkProvider>
  );
}
