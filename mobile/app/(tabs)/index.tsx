import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { MINI_GAMES, GAME_CATEGORIES, MiniGame } from '@/constants/Games';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

/**
 * Home Screen
 * Main screen showing personalized mini-games
 */
export default function HomeScreen() {
  const router = useRouter();
  const { childProfile } = useOnboardingStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);
  const { t, i18n } = useTranslation();

  // Filter games by child's age
  const recommendedGames = MINI_GAMES.filter(
    (game) =>
      childProfile.age &&
      game.minAge <= childProfile.age &&
      game.maxAge >= childProfile.age
  );

  // Filter games by selected category
  const displayedGames = selectedCategory
    ? recommendedGames.filter((game) => game.category === selectedCategory)
    : recommendedGames;

  // Get categories that have games for the child's age
  const availableCategories = Object.entries(GAME_CATEGORIES).filter(([key]) =>
    recommendedGames.some((game) => game.category === key)
  );

  const handleGamePress = (game: MiniGame) => {
    // Navigate to game screen
    router.push(`/games/${game.id}` as any);
  };

  // Get current language code for display
  const getCurrentLanguageCode = () => {
    const lang = i18n.language;
    if (lang.startsWith('pt')) return 'PT';
    if (lang.startsWith('en')) return 'EN';
    if (lang.startsWith('es')) return 'ES';
    return 'PT';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>
                {childProfile.gender === 'boy' ? '👦' : childProfile.gender === 'girl' ? '👧' : '😊'}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>{t('home.greeting')}</Text>
              <Text style={styles.childName}>{childProfile.name || t('home.defaultChildName')}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setLanguageSelectorVisible(true)}
          >
            <Text style={styles.languageText}>{getCurrentLanguageCode()}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === null && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === null && styles.categoryChipTextActive,
                ]}
              >
                {t('home.all')}
              </Text>
            </TouchableOpacity>
            {availableCategories.map(([key, category]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryChip,
                  selectedCategory === key && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(key)}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === key && styles.categoryChipTextActive,
                  ]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Games Section */}
        <View style={styles.section}>
          <View style={styles.gamesGrid}>
            {displayedGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.gameCard}
                onPress={() => handleGamePress(game)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={game.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gameCardGradient}
                >
                  <Text style={styles.gameEmoji}>{game.emoji}</Text>
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    <Text style={styles.gameAge}>
                      {game.minAge}-{game.maxAge} {t('home.years')}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <LanguageSelector
        visible={languageSelectorVisible}
        onClose={() => setLanguageSelectorVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // #FFF8F1 - Warm beige
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textInverse,
    opacity: 0.95,
    fontWeight: '500',
  },
  childName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  languageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text, // #3C3C3C
    marginBottom: 16,
  },
  categoriesContainer: {
    gap: 10,
    paddingBottom: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.surface, // White
    borderWidth: 2,
    borderColor: Colors.border, // #E8E0D8
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: Colors.cta, // #FFA928 - Orange
    borderColor: Colors.cta,
    shadowColor: Colors.ctaDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary, // #6B6B6B
  },
  categoryChipTextActive: {
    color: Colors.textInverse, // White
    fontWeight: '700',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  gameCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.borderLight, // #F2EBE3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  gameCardGradient: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  gameEmoji: {
    fontSize: 52,
  },
  gameInfo: {
    gap: 4,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  gameAge: {
    fontSize: 12,
    color: Colors.textInverse,
    opacity: 0.95,
    fontWeight: '500',
  },
});
