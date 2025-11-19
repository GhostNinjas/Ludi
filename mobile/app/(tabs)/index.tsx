import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { MINI_GAMES, GAME_CATEGORIES, MiniGame } from '@/constants/Games';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { ScreenTransition } from '@/components/ScreenTransition';
import * as Haptics from 'expo-haptics';

/**
 * Home Screen
 * Main screen showing personalized mini-games
 */
export default function HomeScreen() {
  const router = useRouter();
  const { childProfile } = useOnboardingStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useTranslation();

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

  const handleGamePress = async (game: MiniGame) => {
    // Haptic feedback
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Haptic not available
    }
    // Navigate to game screen
    router.push(`/games/${game.id}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
          <HamburgerMenu />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Filter */}
        <View style={styles.section}>
          <ScreenTransition type="slide" delay={100}>
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
          </ScreenTransition>
        </View>

        {/* All Games Section */}
        <View style={styles.section}>
          <View style={styles.gamesGrid}>
            {displayedGames.map((game, index) => (
              <ScreenTransition key={game.id} type="bounce" delay={index * 50} style={styles.gameCardWrapper}>
                <TouchableOpacity
                  style={styles.gameCard}
                  onPress={() => handleGamePress(game)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[...game.gradient] as any}
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
              </ScreenTransition>
            ))}
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 13,
    color: Colors.textInverse,
    opacity: 0.95,
    fontWeight: '500',
  },
  childName: {
    fontSize: 20,
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
  contentContainer: {
    paddingBottom: 20,
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
    justifyContent: 'center',
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
    backgroundColor: Colors.vibrant.electricBlue,
    borderColor: Colors.vibrant.electricBlue,
    shadowColor: Colors.vibrant.purplePower,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
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
    justifyContent: 'center',
  },
  gameCardWrapper: {
    width: '48%',
  },
  gameCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
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
