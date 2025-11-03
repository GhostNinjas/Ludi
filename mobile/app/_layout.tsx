import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { initI18n } from '@/lib/i18n';
import { useAuthStore } from '@/lib/store/authStore';
import { StyleSheet } from 'react-native';

/**
 * Root layout component for the app.
 * Handles initialization and global providers.
 */
export default function RootLayout() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize i18n
    initI18n();

    // Check for stored auth token
    initAuth();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
