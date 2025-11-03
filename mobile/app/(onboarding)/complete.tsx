import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useTranslation } from 'react-i18next';

/**
 * Onboarding Complete Screen
 * Final celebration screen before entering the app
 */
export default function CompleteScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStore();
  const { t } = useTranslation();

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={Colors.gradients.warm}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Main Content */}
          <View style={styles.centerContent}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>🎉</Text>
              <Text style={styles.emojiSecondary}>✨</Text>
            </View>
            <Text style={styles.title}>{t('onboarding.complete.title')}</Text>
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Text style={styles.featureEmoji}>🎮</Text>
                <Text style={styles.featureText}>{t('onboarding.complete.features.personalizedGames')}</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureEmoji}>🎯</Text>
                <Text style={styles.featureText}>{t('onboarding.complete.features.adaptedContent')}</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureEmoji}>📊</Text>
                <Text style={styles.featureText}>{t('onboarding.complete.features.progressTracking')}</Text>
              </View>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleStart}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('onboarding.complete.startPlaying')}</Text>
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
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 100,
    textAlign: 'center',
  },
  emojiSecondary: {
    position: 'absolute',
    fontSize: 40,
    top: -10,
    right: -20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 30,
    marginBottom: 48,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 400,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSection: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.textInverse,
    paddingVertical: 20,
    borderRadius: 30,
    width: '100%',
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
    color: Colors.cta,
  },
});
