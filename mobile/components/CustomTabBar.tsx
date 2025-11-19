import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius, Shadows } from '@/constants/Theme';

/**
 * Custom Tab Bar Component
 * Playful, animated bottom navigation for kids with glassmorphism effect
 */
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {/* Glassmorphism background */}
      <LinearGradient
        colors={['rgba(255, 248, 241, 0.8)', 'rgba(255, 248, 241, 0.9)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle top border with gradient */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0)',
          Colors.vibrant.electricBlue + '30',
          Colors.vibrant.playfulPink + '30',
          'rgba(255,255,255,0)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBorder}
      />

      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = async () => {
            // Haptic feedback
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              // Haptic not available
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Get icon from options
          const iconComponent = options.tabBarIcon
            ? options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? Colors.vibrant.electricBlue : Colors.textSecondary,
                size: 24,
              })
            : null;

          return (
            <TabButton
              key={route.key}
              label={label as string}
              icon={iconComponent}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

/**
 * Individual Tab Button with Animation
 */
function TabButton({
  label,
  icon,
  isFocused,
  onPress,
  onLongPress,
}: {
  label: string;
  icon: React.ReactNode;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  // Animation values
  const scale = useRef(new Animated.Value(1)).current;

  // Animate when focused state changes
  useEffect(() => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.1 : 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
      testID={`tab-${label}`}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tab}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{ scale }],
          },
        ]}
      >
        {/* Background pill for active tab */}
        {isFocused && (
          <View style={styles.activePillContainer}>
            <LinearGradient
              colors={[Colors.vibrant.electricBlue + '15', Colors.vibrant.playfulPink + '15']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.activePill}
            />
          </View>
        )}

        {/* Icon */}
        <View style={styles.iconContainer}>
          {icon}
        </View>

        {/* Label */}
        <Text
          style={[
            styles.label,
            isFocused && styles.labelActive,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === 'ios' ? 20 : Spacing.md,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  topBorder: {
    height: 1,
    width: '100%',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  activePillContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    position: 'absolute',
    top: -4,
    left: 4,
    right: 4,
    bottom: -4,
    borderRadius: BorderRadius.xxl,
  },
  iconContainer: {
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  labelActive: {
    color: Colors.vibrant.electricBlue,
    fontWeight: '700',
  },
});
