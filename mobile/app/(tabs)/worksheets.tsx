import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

/**
 * Worksheets Screen
 * Printable worksheets and activities
 */
export default function WorksheetsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{t('worksheets.headerTitle')}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.emoji}>📝</Text>
        <Text style={styles.title}>{t('worksheets.comingSoon')}</Text>
        <Text style={styles.description}>
          {t('worksheets.description')}
        </Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
