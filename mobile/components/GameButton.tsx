import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/Theme';

interface GameButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  gradient?: readonly string[];
  style?: ViewStyle;
  emoji?: string;
}

/**
 * GameButton Component
 * Playful, animated button for games
 */
export function GameButton({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  gradient,
  style,
  emoji,
}: GameButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  // Idle bounce animation
  useEffect(() => {
    if (!disabled && variant === 'primary') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: -4,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounce, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [disabled, variant]);

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = async () => {
    if (!disabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptic not available
      }
      onPress();
    }
  };

  const getButtonStyle = () => {
    const sizeStyles = {
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    };

    return [styles.button, sizeStyles[size], disabled && styles.disabled, style];
  };

  const getGradientColors = (): string[] => {
    if (gradient) return [...gradient];

    switch (variant) {
      case 'success':
        return [Colors.success, Colors.successDark];
      case 'warning':
        return [Colors.warning, Colors.ctaDark];
      case 'gradient':
        return [...Colors.gradients.rainbow];
      default:
        return [Colors.vibrant.electricBlue, Colors.vibrant.purplePower];
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }, { translateY: bounce }],
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
        disabled={disabled}
        style={getButtonStyle()}
      >
        <LinearGradient
          colors={(disabled ? [Colors.border, Colors.borderLight] : getGradientColors()) as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {emoji && <Text style={styles.emoji}>{emoji}</Text>}
          <Text style={[styles.text, disabled && styles.textDisabled]}>
            {children}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  small: {
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
  },
  medium: {
    minHeight: 56,
    paddingHorizontal: Spacing.xl,
  },
  large: {
    minHeight: 64,
    paddingHorizontal: Spacing.xxl,
  },
  disabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 24,
  },
  text: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  textDisabled: {
    color: Colors.textSecondary,
  },
});
