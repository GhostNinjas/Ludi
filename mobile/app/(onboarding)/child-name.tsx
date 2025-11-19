import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useTranslation } from 'react-i18next';

/**
 * Child Name Onboarding Screen
 * First step: Ask for the child's name
 */
export default function ChildNameScreen() {
  const router = useRouter();
  const { childProfile, setChildName } = useOnboardingStore();
  const [name, setName] = useState(childProfile.name || '');
  const { t } = useTranslation();

  const handleContinue = () => {
    if (name.trim()) {
      setChildName(name.trim());
      router.push('/(onboarding)/child-age');
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.step}>{t('onboarding.step', { current: 1, total: 5 })}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '20%' }]} />
              </View>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
              <Text style={styles.emoji}>👶</Text>
              <Text style={styles.question}>
                {t('onboarding.childName.question')}
              </Text>
              <Text style={styles.hint}>
                {t('onboarding.childName.hint')}
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={t('onboarding.childName.placeholder')}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus
                />
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={[
                styles.button,
                !name.trim() && styles.buttonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!name.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('onboarding.childName.continue')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
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
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 20,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  button: {
    backgroundColor: Colors.cta,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: Colors.ctaDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
});
