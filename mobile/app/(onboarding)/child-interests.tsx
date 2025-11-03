import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useTranslation } from 'react-i18next';

/**
 * Child Interests Onboarding Screen
 * Fourth step: Ask for the child's interests
 */
export default function ChildInterestsScreen() {
  const router = useRouter();
  const { childProfile, setChildInterests } = useOnboardingStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(childProfile.interests);
  const { t } = useTranslation();

  const interests = [
    { id: 'animals', label: t('onboarding.childInterests.interests.animals'), emoji: '🐶' },
    { id: 'colors', label: t('onboarding.childInterests.interests.colors'), emoji: '🎨' },
    { id: 'numbers', label: t('onboarding.childInterests.interests.numbers'), emoji: '🔢' },
    { id: 'letters', label: t('onboarding.childInterests.interests.letters'), emoji: '🔤' },
    { id: 'music', label: t('onboarding.childInterests.interests.music'), emoji: '🎵' },
    { id: 'sports', label: t('onboarding.childInterests.interests.sports'), emoji: '⚽' },
    { id: 'nature', label: t('onboarding.childInterests.interests.nature'), emoji: '🌳' },
    { id: 'vehicles', label: t('onboarding.childInterests.interests.vehicles'), emoji: '🚗' },
    { id: 'food', label: t('onboarding.childInterests.interests.food'), emoji: '🍎' },
    { id: 'space', label: t('onboarding.childInterests.interests.space'), emoji: '🚀' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      setChildInterests(selectedInterests);
      router.push('/(onboarding)/special-needs');
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
            <Text style={styles.step}>{t('onboarding.step', { current: 4, total: 5 })}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '80%' }]} />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.emoji}>🎯</Text>
            <Text style={styles.question}>
              {t('onboarding.childInterests.question')}
            </Text>
            <Text style={styles.hint}>
              {t('onboarding.childInterests.hint')}
            </Text>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.interestsGrid}
              showsVerticalScrollIndicator={false}
            >
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestCard,
                    selectedInterests.includes(interest.id) &&
                      styles.interestCardSelected,
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                  <Text
                    style={[
                      styles.interestLabel,
                      selectedInterests.includes(interest.id) &&
                        styles.interestLabelSelected,
                    ]}
                  >
                    {interest.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              selectedInterests.length === 0 && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedInterests.length === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {selectedInterests.length > 0
                ? t('onboarding.childInterests.continueCount', { count: selectedInterests.length })
                : t('onboarding.childInterests.continue')}
            </Text>
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
    marginBottom: 32,
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
    fontSize: 64,
    marginBottom: 16,
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  hint: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  interestCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  interestCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  interestEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  interestLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  interestLabelSelected: {
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
