import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function RootLayout() {
  const restoreToken = useAuthStore((state) => state.restoreToken);
  const token = useAuthStore((state) => state.token);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Restore token from AsyncStorage on app start
    const initAuth = async () => {
      await restoreToken();
      setIsHydrated(true);
    };

    initAuth();
  }, [restoreToken]);

  // While hydrating, show splash screen
  if (!isHydrated) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(splash)"
          options={{}}
        />
      </Stack>
    );
  }

  // After hydrated, show appropriate stack based on token
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {!token ? (
        // Auth Stack - show login/register
        <Stack.Screen
          name="(auth)"
          options={{}}
        />
      ) : (
        // App Stack - show home tabs
        <Stack.Screen
          name="(tabs)"
          options={{}}
        />
      )}
      <Stack.Screen
        name="products"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
