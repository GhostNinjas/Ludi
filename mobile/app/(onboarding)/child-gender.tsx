import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

/**
 * Child Gender Onboarding Screen
 * Third step: Ask for the child's gender
 */
export default function ChildGenderScreen() {
  const router = useRouter();
  const { childProfile, setChildGender } = useOnboardingStore();
  const [selectedGender, setSelectedGender] = useState<string | null>(childProfile.gender);
  const { t } = useTranslation();

  const genders = [
    { value: 'boy', label: t('onboarding.childGender.options.boy'), emoji: '👦' },
    { value: 'girl', label: t('onboarding.childGender.options.girl'), emoji: '👧' },
    { value: 'other', label: t('onboarding.childGender.options.other'), emoji: '😊' },
  ];

  const handleContinue = () => {
    if (selectedGender !== null) {
      setChildGender(selectedGender);
      router.push('/(onboarding)/child-interests');
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
            <Text style={styles.step}>{t('onboarding.step', { current: 3, total: 5 })}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '60%' }]} />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.question}>{t('onboarding.childGender.question')}</Text>

            <View style={styles.optionsContainer}>
              {genders.map((gender) => (
                <TouchableOpacity
                  key={gender.value}
                  style={[
                    styles.optionButton,
                    selectedGender === gender.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedGender(gender.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{gender.emoji}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      selectedGender === gender.value && styles.optionTextSelected,
                    ]}
                  >
                    {gender.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              selectedGender === null && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedGender === null}
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
    justifyContent: 'center',
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 400,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
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
