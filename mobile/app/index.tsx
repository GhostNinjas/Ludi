import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

/**
 * Welcome Screen
 * Beautiful welcome screen with a "Continue" button to start the onboarding flow
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const { isOnboardingComplete } = useOnboardingStore();

  // Redirect to home if onboarding is complete
  useEffect(() => {
    if (isOnboardingComplete) {
      router.replace('/(tabs)');
    }
  }, [isOnboardingComplete]);

  const handleContinue = () => {
    router.push('/(onboarding)/child-name');
  };

  return (
    <LinearGradient
      colors={[Colors.primary, '#8B5CF6', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Main Content */}
          <View style={styles.centerContent}>
            <Text style={styles.emoji}>🎮</Text>
            <Text style={styles.title}>Bem-vindo ao</Text>
            <Text style={styles.appName}>Ludi</Text>
            <Text style={styles.subtitle}>
              Aprendizado divertido e personalizado{'\n'}para o seu filho
            </Text>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.description}>
              Jogos educativos adaptados para{'\n'}
              crianças de 1 a 6 anos
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 26,
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.85,
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    minWidth: width * 0.7,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
