import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useTranslation } from 'react-i18next';

/**
 * Parents Screen
 * Information and settings for parents
 */
export default function ParentsScreen() {
  const { childProfile, resetOnboarding } = useOnboardingStore();
  const { t } = useTranslation();

  const handleResetProfile = () => {
    if (confirm(t('parents.confirmReset'))) {
      resetOnboarding();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{t('parents.headerTitle')}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Child Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('parents.childProfile')}</Text>
          <View style={styles.profileInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('parents.name')}:</Text>
              <Text style={styles.infoValue}>{childProfile.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('parents.age')}:</Text>
              <Text style={styles.infoValue}>{childProfile.age} {t('home.years')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('parents.gender')}:</Text>
              <Text style={styles.infoValue}>
                {childProfile.gender === 'boy'
                  ? t('parents.boy')
                  : childProfile.gender === 'girl'
                  ? t('parents.girl')
                  : t('parents.notInformed')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('parents.interests')}:</Text>
              <Text style={styles.infoValue}>
                {childProfile.interests.length} {t('parents.selected')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('parents.specialNeeds')}:</Text>
              <Text style={styles.infoValue}>
                {childProfile.specialNeeds.includes('none')
                  ? t('parents.none')
                  : childProfile.specialNeeds.join(', ')}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleResetProfile}>
            <Text style={styles.editButtonText}>{t('parents.resetProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Features Cards */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Text style={styles.featureTitle}>{t('parents.progress')}</Text>
            <Text style={styles.featureDescription}>
              {t('parents.progressDescription')}
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>⚙️</Text>
            <Text style={styles.featureTitle}>{t('parents.settings')}</Text>
            <Text style={styles.featureDescription}>
              {t('parents.settingsDescription')}
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>💡</Text>
            <Text style={styles.featureTitle}>{t('parents.tipsForParents')}</Text>
            <Text style={styles.featureDescription}>
              {t('parents.tipsDescription')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  profileInfo: {
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuresSection: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
