import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

/**
 * Child Age Onboarding Screen
 * Second step: Ask for the child's age
 */
export default function ChildAgeScreen() {
  const router = useRouter();
  const { childProfile, setChildAge } = useOnboardingStore();
  const [selectedAge, setSelectedAge] = useState<number | null>(childProfile.age);
  const { t } = useTranslation();

  const ages = [
    { value: 1, label: t('onboarding.childAge.ages.one'), emoji: '👶' },
    { value: 2, label: t('onboarding.childAge.ages.years', { count: 2 }), emoji: '🧒' },
    { value: 3, label: t('onboarding.childAge.ages.years', { count: 3 }), emoji: '👧' },
    { value: 4, label: t('onboarding.childAge.ages.years', { count: 4 }), emoji: '🧑' },
    { value: 5, label: t('onboarding.childAge.ages.years', { count: 5 }), emoji: '👦' },
    { value: 6, label: t('onboarding.childAge.ages.sixPlus'), emoji: '🧒' },
  ];

  const handleContinue = () => {
    if (selectedAge !== null) {
      setChildAge(selectedAge);
      router.push('/(onboarding)/child-gender');
    }
  };

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.step}>{t('onboarding.step', { current: 2, total: 5 })}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '40%' }]} />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.emoji}>🎂</Text>
            <Text style={styles.question}>{t('onboarding.childAge.question')}</Text>

            <ScrollView
              style={styles.optionsContainer}
              contentContainerStyle={styles.optionsContent}
              showsVerticalScrollIndicator={false}
            >
              {ages.map((age) => (
                <TouchableOpacity
                  key={age.value}
                  style={[
                    styles.optionButton,
                    selectedAge === age.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedAge(age.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{age.emoji}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      selectedAge === age.value && styles.optionTextSelected,
                    ]}
                  >
                    {age.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, selectedAge === null && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={selectedAge === null}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t('onboarding.childName.continue')}</Text>
          </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  step: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  question: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  hint: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flex: 1,
    width: '100%',
  },
  optionsContent: {
    paddingBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  optionButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionTextSelected: {
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.cta,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(230, 148, 32, 0.3)',
    elevation: 8,
  } as any,
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
});
