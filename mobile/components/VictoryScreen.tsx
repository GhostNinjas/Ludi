import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/Theme';

interface VictoryScreenProps {
  visible: boolean;
  score?: number;
  stars?: 1 | 2 | 3;
  message?: string;
  onPlayAgain?: () => void;
  onHome?: () => void;
}

/**
 * VictoryScreen Component
 * Celebratory modal shown when player wins
 */
export function VictoryScreen({
  visible,
  score,
  stars = 3,
  message = 'Parabéns!',
  onPlayAgain,
  onHome,
}: VictoryScreenProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const starScale1 = useRef(new Animated.Value(0)).current;
  const starScale2 = useRef(new Animated.Value(0)).current;
  const starScale3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Haptic celebration
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        // Haptic not available
      }

      // Animate entrance
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Stars pop in one by one
        Animated.stagger(150, [
          Animated.spring(starScale1, {
            toValue: 1,
            tension: 100,
            friction: 5,
            useNativeDriver: true,
          }),
          stars >= 2
            ? Animated.spring(starScale2, {
                toValue: 1,
                tension: 100,
                friction: 5,
                useNativeDriver: true,
              })
            : Animated.timing(starScale2, { toValue: 0, duration: 0, useNativeDriver: true }),
          stars >= 3
            ? Animated.spring(starScale3, {
                toValue: 1,
                tension: 100,
                friction: 5,
                useNativeDriver: true,
              })
            : Animated.timing(starScale3, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ]).start();
    } else {
      // Reset animations
      scale.setValue(0);
      opacity.setValue(0);
      starScale1.setValue(0);
      starScale2.setValue(0);
      starScale3.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <LinearGradient
              colors={Colors.gradients.rainbow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              {/* Emoji celebration */}
              <Text style={styles.celebrationEmoji}>🎉</Text>

              {/* Message */}
              <Text style={styles.message}>{message}</Text>

              {/* Stars */}
              <View style={styles.starsContainer}>
                <Animated.Text
                  style={[
                    styles.star,
                    {
                      transform: [{ scale: starScale1 }],
                    },
                  ]}
                >
                  ⭐
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.star,
                    styles.starLarge,
                    {
                      transform: [{ scale: starScale2 }],
                    },
                  ]}
                >
                  ⭐
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.star,
                    {
                      transform: [{ scale: starScale3 }],
                    },
                  ]}
                >
                  ⭐
                </Animated.Text>
              </View>

              {/* Score */}
              {score !== undefined && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Pontuação</Text>
                  <Text style={styles.scoreValue}>{score}</Text>
                </View>
              )}

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                {onPlayAgain && (
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={onPlayAgain}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>🔄 Jogar Novamente</Text>
                  </TouchableOpacity>
                )}
                {onHome && (
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={onHome}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                      🏠 Voltar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  card: {
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  gradient: {
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: '700',
    color: Colors.textInverse,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  star: {
    fontSize: 40,
  },
  starLarge: {
    fontSize: 56,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  scoreLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.textInverse,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  scoreValue: {
    fontSize: Typography.sizes.huge,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  buttonsContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  button: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  primaryButton: {
    backgroundColor: Colors.textInverse,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: Colors.textInverse,
  },
  buttonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.vibrant.purplePower,
  },
  secondaryButtonText: {
    color: Colors.textInverse,
  },
});
