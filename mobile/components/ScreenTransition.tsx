import { useEffect, useRef, ReactNode } from 'react';
import { Animated, ViewStyle, StyleSheet } from 'react-native';
import { Animations } from '@/constants/Theme';

interface ScreenTransitionProps {
  children: ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

/**
 * ScreenTransition Component
 * Smooth entrance animations for screens and components
 */
export function ScreenTransition({
  children,
  type = 'fade',
  duration = Animations.durations.normal,
  delay = 0,
  style,
}: ScreenTransitionProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    // Always fade in
    animations.push(
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      })
    );

    // Add type-specific animations
    switch (type) {
      case 'slide':
        animations.push(
          Animated.spring(translateY, {
            toValue: 0,
            ...Animations.spring.gentle,
            delay,
          })
        );
        break;
      case 'scale':
        animations.push(
          Animated.spring(scale, {
            toValue: 1,
            ...Animations.spring.bouncy,
            delay,
          })
        );
        break;
      case 'bounce':
        animations.push(
          Animated.spring(scale, {
            toValue: 1,
            tension: 40,
            friction: 4,
            useNativeDriver: true,
            delay,
          })
        );
        break;
    }

    Animated.parallel(animations).start();
  }, []);

  const getTransform = () => {
    const transforms: any[] = [];

    if (type === 'slide') {
      transforms.push({ translateY });
    }

    if (type === 'scale' || type === 'bounce') {
      transforms.push({ scale });
    }

    return transforms;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: getTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Stagger Animation Wrapper
 * For animating lists of items with delay between each
 */
interface StaggeredListProps {
  children: ReactNode[];
  staggerDelay?: number;
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
}

export function StaggeredList({
  children,
  staggerDelay = 50,
  type = 'slide',
}: StaggeredListProps) {
  return (
    <>
      {children.map((child, index) => (
        <ScreenTransition
          key={index}
          type={type}
          delay={index * staggerDelay}
        >
          {child}
        </ScreenTransition>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // Width can be overridden by style prop
  },
});
