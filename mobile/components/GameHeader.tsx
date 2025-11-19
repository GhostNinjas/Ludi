import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { Typography, Spacing, BorderRadius } from '@/constants/Theme';

interface GameHeaderProps {
  title: string;
  emoji?: string;
  gradient?: readonly string[];
  score?: number;
  lives?: number;
  showBack?: boolean;
}

/**
 * GameHeader Component
 * Colorful, playful header for game screens
 */
export function GameHeader({
  title,
  emoji,
  gradient = Colors.gradients.primary,
  score,
  lives,
  showBack = true,
}: GameHeaderProps) {
  const router = useRouter();

  const handleBack = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptic not available
    }
    router.back();
  };

  return (
    <LinearGradient
      colors={[...gradient] as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.container}>
          {/* Left: Back button */}
          <View style={styles.leftSection}>
            {showBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Center: Title */}
          <View style={styles.centerSection}>
            {emoji && <Text style={styles.emoji}>{emoji}</Text>}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Right: Score/Lives */}
          <View style={styles.rightSection}>
            {score !== undefined && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>⭐</Text>
                <Text style={styles.scoreValue}>{score}</Text>
              </View>
            )}
            {lives !== undefined && (
              <View style={styles.livesContainer}>
                <Text style={styles.livesValue}>
                  {'❤️'.repeat(lives)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
  },
  safeArea: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 60,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.textInverse,
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scoreLabel: {
    fontSize: 16,
  },
  scoreValue: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  livesValue: {
    fontSize: 16,
  },
});
