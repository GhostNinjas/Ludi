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
 * Special Needs Onboarding Screen
 * Fourth step: Ask about special needs (including ADHD)
 */
export default function SpecialNeedsScreen() {
  const router = useRouter();
  const { childProfile, setChildSpecialNeeds } = useOnboardingStore();
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(
    childProfile.specialNeeds.length > 0 ? childProfile.specialNeeds : ['none']
  );
  const { t } = useTranslation();

  const specialNeeds = [
    { id: 'none', label: t('onboarding.specialNeeds.options.none'), emoji: '✨' },
    { id: 'autism', label: t('onboarding.specialNeeds.options.autism'), emoji: '🧩' },
    { id: 'dyslexia', label: t('onboarding.specialNeeds.options.dyslexia'), emoji: '📖' },
    { id: 'learning_difficulties', label: t('onboarding.specialNeeds.options.learningDifficulties'), emoji: '🎓' },
    { id: 'speech_delay', label: t('onboarding.specialNeeds.options.speechDelay'), emoji: '💬' },
    { id: 'other', label: t('onboarding.specialNeeds.options.other'), emoji: '🤝' },
  ];

  const toggleNeed = (id: string) => {
    // If "none" is selected, clear all others
    if (id === 'none') {
      setSelectedNeeds(['none']);
      return;
    }

    // If any other option is selected, remove "none"
    let newNeeds = selectedNeeds.filter((n) => n !== 'none');

    if (newNeeds.includes(id)) {
      newNeeds = newNeeds.filter((n) => n !== id);
    } else {
      newNeeds = [...newNeeds, id];
    }

    // If no options selected, default to "none"
    if (newNeeds.length === 0) {
      newNeeds = ['none'];
    }

    setSelectedNeeds(newNeeds);
  };

  const handleContinue = () => {
    if (selectedNeeds.length > 0) {
      setChildSpecialNeeds(selectedNeeds);
      router.push('/(onboarding)/complete');
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
            <Text style={styles.step}>{t('onboarding.step', { current: 4, total: 4 })}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '100%' }]} />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.emoji}>💙</Text>
            <Text style={styles.question}>
              Seu filho tem alguma{'\n'}necessidade especial?
            </Text>
            <Text style={styles.hint}>
              Isso nos ajuda a adaptar melhor os jogos
            </Text>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.needsContainer}
              showsVerticalScrollIndicator={false}
            >
              {specialNeeds.map((need) => (
                <TouchableOpacity
                  key={need.id}
                  style={[
                    styles.needCard,
                    selectedNeeds.includes(need.id) && styles.needCardSelected,
                  ]}
                  onPress={() => toggleNeed(need.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.needEmoji}>{need.emoji}</Text>
                  <Text
                    style={[
                      styles.needLabel,
                      selectedNeeds.includes(need.id) && styles.needLabelSelected,
                    ]}
                  >
                    {need.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t('onboarding.specialNeeds.finalize')}</Text>
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
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  needsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  needCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    minHeight: 100,
    justifyContent: 'center',
  },
  needCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  needEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  needLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  needLabelSelected: {
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.cta,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: Colors.ctaDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
});
